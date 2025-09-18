<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Notifications\NewReservation;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Http; // <-- Added for reCAPTCHA
use Carbon\Carbon; // <-- Added for date handling

class ReservationController extends Controller
{
    /**
     * Menampilkan semua data reservasi.
     */
    public function index()
    {
        // Mengurutkan dari yang terbaru
        $reservations = Reservation::with('selectedMenus')->latest()->get();
        return response()->json([
            'success' => true,
            'message' => 'Daftar semua reservasi.',
            'data' => $reservations
        ], 200);
    }

    /**
     * Menyimpan reservasi baru.
     */
    public function store(Request $request)
    {
        // Log request untuk debugging
        Log::info('Reservation request received:', $request->all());

        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'whatsapp' => 'required|string|max:20',
                'date' => 'required|date',
                'time' => 'required|string', // Ubah dari date_format:H:i ke string
                'people' => 'required|integer|min:1',
                'type' => 'required|string|in:meja,event',
                'area' => 'nullable|string',
                'eventDetails' => 'nullable|string',
                'recaptcha_token' => 'required|string', // <-- Added reCAPTCHA token validation
            ]);

            if ($validator->fails()) {
                Log::error('Validation failed:', $validator->errors()->toArray());
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // --- VERIFY RECAPTCHA TOKEN ---
            $recaptchaResponse = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
                'secret' => env('RECAPTCHA_SECRET_KEY'),
                'response' => $request->recaptcha_token,
            ]);

            if (!$recaptchaResponse->json()['success']) {
                Log::error('reCAPTCHA verification failed:', $recaptchaResponse->json());
                return response()->json([
                    'success' => false,
                    'message' => 'Verifikasi reCAPTCHA gagal. Silakan coba lagi.'
                ], 400);
            }
            // --- END RECAPTCHA VERIFICATION ---

            // --- ADD RESERVATION LIMITATION BLOCK ---
            $whatsappNumber = $request->whatsapp;
            $today = Carbon::today();

            $reservationsCount = Reservation::where('whatsapp', $whatsappNumber)
                ->whereDate('created_at', $today)
                ->count();

            if ($reservationsCount >= 3) {
                // If already 3 or more, return error
                Log::warning('Reservation limit exceeded for WhatsApp: ' . $whatsappNumber . ' - Count: ' . $reservationsCount);
                return response()->json([
                    'success' => false,
                    'message' => 'Anda telah mencapai batas maksimal reservasi untuk hari ini (3 kali). Silakan coba lagi besok.'
                ], 429); // 429 Too Many Requests
            }
            // --- END LIMITATION BLOCK ---

            // Membuat nomor reservasi unik
            $reservationNumber = 'KNG-' . date('Ymd') . '-' . strtoupper(Str::random(6));

            Log::info('Creating reservation with number: ' . $reservationNumber);

            $reservation = Reservation::create([
                'name' => $request->name,
                'whatsapp' => $request->whatsapp,
                'date' => $request->date,
                'time' => $request->time,
                'people' => $request->people,
                'type' => $request->type,
                'area' => $request->area,
                'eventDetails' => $request->eventDetails,
                'reservationNumber' => $reservationNumber,
                'status' => 'Menunggu Konfirmasi',
            ]);

            Log::info('Reservation created successfully:', $reservation->toArray());

            // Kirim notifikasi ke semua admin
            try {
                $users = User::all(); // Get all users since there's no role system
                Log::info('Found users count: ' . $users->count());
                
                if ($users->count() > 0) {
                    Notification::send($users, new NewReservation($reservation));
                    Log::info('Notifications sent successfully to all users');
                } else {
                    Log::warning('No users found to send notification');
                }
            } catch (\Exception $notifError) {
                Log::error('Notification error (but reservation saved): ' . $notifError->getMessage());
                Log::error('Full error: ' . $notifError->getTraceAsString());
            }
            return response()->json([
                'success' => true,
                'message' => 'Reservasi berhasil dibuat.',
                'data' => $reservation
            ], 201);

        } catch (\Exception $e) {
            Log::error('Reservation creation failed: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat membuat reservasi.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Menampilkan satu reservasi spesifik.
     */
    public function show(Reservation $reservation)
    {
        $reservation->load('selectedMenus');
        return response()->json([
            'success' => true,
            'message' => 'Detail reservasi.',
            'data' => $reservation
        ], 200);
    }

    /**
     * Memperbarui reservasi yang ada.
     */
    public function update(Request $request, Reservation $reservation)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'sometimes|required|string|in:Menunggu Konfirmasi,Dikonfirmasi,Bukti DP Diupload,DP Dibayar,Menu Dipilih,Selesai,Ditolak',
            'name' => 'sometimes|required|string|max:255',
            'whatsapp' => 'sometimes|required|string|max:20',
            'date' => 'sometimes|required|date',
            'time' => 'sometimes|required|string',
            'people' => 'sometimes|required|integer|min:1',
        ]);

        if ($validator->fails()) {
            Log::error('Update validation failed: ' . json_encode($validator->errors()));
            return response()->json(['errors' => $validator->errors()], 422);
        }

        Log::info('Updating reservation ' . $reservation->id . ' with data: ' . json_encode($request->all()));

        $reservation->update($request->all());

        Log::info('Reservation updated successfully: ' . json_encode($reservation->fresh()));

        return response()->json([
            'success' => true,
            'message' => 'Reservasi berhasil diperbarui.',
            'data' => $reservation
        ], 200);
    }

    /**
     * Menghapus reservasi.
     */
    public function destroy(Reservation $reservation)
    {
        if ($reservation->dp_proof_path) {
            Storage::disk('public')->delete($reservation->dp_proof_path);
        }
        $reservation->delete();

        return response()->json([
            'success' => true,
            'message' => 'Reservasi berhasil dihapus.'
        ], 200);
    }

    /**
     * Mencari reservasi berdasarkan nomor dan nama.
     */
    public function search(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'reservationNumber' => 'required|string',
            'name' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $query = Reservation::where('reservationNumber', $request->reservationNumber);

        if ($request->filled('name')) {
            $query->where('name', $request->name);
        }

        $reservation = $query->first();

        if ($reservation) {
            return response()->json(['success' => true, 'data' => $reservation], 200);
        }

        return response()->json(['success' => false, 'message' => 'Reservasi tidak ditemukan.'], 404);
    }

    /**
     * Mengunggah bukti DP.
     */
    public function uploadDp(Request $request, Reservation $reservation)
    {
        $validator = Validator::make($request->all(), [
            'proof' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        if ($request->hasFile('proof')) {
            if ($reservation->dp_proof_path) {
                Storage::disk('public')->delete($reservation->dp_proof_path);
            }

            $file = $request->file('proof');
            $extension = $file->getClientOriginalExtension();
            $sanitizedName = preg_replace('/[^A-Za-z0-9\-]/', '', str_replace(' ', '-', $reservation->name));
            $newFilename = $reservation->reservationNumber . '_' . $sanitizedName . '.' . $extension;

            $path = $file->storeAs('images/dp_proofs', $newFilename, 'public');

            $reservation->update([
                'dp_proof_path' => $path,
                'status' => 'Bukti DP Diupload',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Bukti DP berhasil diunggah.',
                'data' => $reservation
            ], 200);
        }

        return response()->json(['success' => false, 'message' => 'File tidak ditemukan.'], 400);
    }

    /**
     * Menyimpan pilihan menu untuk reservasi.
     */
    public function selectMenus(Request $request, Reservation $reservation)
    {
        $validator = Validator::make($request->all(), [
            'selectedMenus' => 'required|array',
            'selectedMenus.*.id' => 'required|integer',
            'selectedMenus.*.name' => 'required|string',
            'selectedMenus.*.price' => 'required|string',
            'selectedMenus.*.quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $reservation->selectedMenus()->delete();

        foreach ($request->selectedMenus as $menu) {
            $reservation->selectedMenus()->create([
                'menu_name' => $menu['name'],
                'quantity'  => $menu['quantity'],
                'price'     => $menu['price'],
            ]);
        }

        $reservation->update(['status' => 'Menu Dipilih']);

        return response()->json([
            'success' => true,
            'message' => 'Pilihan menu berhasil disimpan.',
        ], 200);
    }
}