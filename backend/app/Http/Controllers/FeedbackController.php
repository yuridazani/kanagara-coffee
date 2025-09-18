<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class FeedbackController extends Controller
{
    /**
     * Menampilkan semua feedback, termasuk menu ratingnya.
     */
    public function index()
    {
        // Memuat relasi 'menuRatings' yang akan menjadi 'menu_ratings' di JSON
        $feedback = Feedback::with('menuRatings')->latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Daftar semua feedback.',
            'data' => $feedback
        ], 200);
    }

    /**
     * Menyimpan feedback baru (HANYA SATU FOTO).
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string|max:255',
            'visitDate' => 'required|date',
            'visitTime' => 'required|date_format:H:i',
            'cafeRating' => 'required|integer|min:1|max:5',
            'cafeComment' => 'required|string',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048', // Diubah kembali ke 'photo' (tunggal)
            'menuRatings' => 'nullable|array',
            'menuRatings.*.menuName' => 'required_with:menuRatings|string',
            'menuRatings.*.rating' => 'required_with:menuRatings|integer|min:1|max:5',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $photo_path = null;
        if ($request->hasFile('photo')) {
            $photo_path = $request->file('photo')->store('images/feedback', 'public');
        }

        try {
            DB::beginTransaction();

            $feedback = Feedback::create([
                'name' => $request->name,
                'visitDate' => $request->visitDate,
                'visitTime' => $request->visitTime,
                'cafeRating' => $request->cafeRating,
                'cafeComment' => $request->cafeComment,
                'photo_path' => $photo_path, // Menyimpan path foto tunggal
            ]);

            if ($request->has('menuRatings')) {
                foreach ($request->menuRatings as $ratingData) {
                    $feedback->menuRatings()->create([
                        'menuName' => $ratingData['menuName'],
                        'rating' => $ratingData['rating'],
                    ]);
                }
            }
            
            DB::commit();

            $feedback->load('menuRatings'); // Muat relasi untuk respons

            return response()->json([
                'success' => true,
                'message' => 'Feedback berhasil dikirim.',
                'data' => $feedback,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            if ($photo_path) {
                Storage::disk('public')->delete($photo_path);
            }
            return response()->json(['success' => false, 'message' => 'Terjadi kesalahan.'], 500);
        }
    }

    /**
     * Menghapus feedback.
     */
    public function destroy(Feedback $feedback)
    {
        if ($feedback->photo_path) {
            Storage::disk('public')->delete($feedback->photo_path);
        }
        $feedback->delete();
        return response()->json(['success' => true, 'message' => 'Feedback berhasil dihapus.']);
    }
}