<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Models\GalleryImage;
use App\Models\Facility;
use App\Models\HeroImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class WebsiteContentController extends Controller
{
    // Mengambil SEMUA konten website untuk ditampilkan
    public function getAllContent()
    {
        try {
            // Clear cache agar data selalu fresh
            Cache::forget('website_content');
            
            $settingsRaw = Setting::all()->keyBy('key');
            // Hanya ambil 'value' dari setiap setting
            $settings = $settingsRaw->map(fn ($item) => $item->value);

            $content = [
                'settings' => $settings,
                'gallery' => GalleryImage::latest()->get(),
                'facilities' => Facility::orderBy('name')->get(), // Ambil SEMUA fasilitas
                'hero_images' => HeroImage::latest()->get(), // Ambil SEMUA gambar hero
            ];

            // Set cache untuk 5 menit saja agar tidak terlalu lama
            Cache::put('website_content', $content, 300);

            return response()->json($content, 200, [
                'Cache-Control' => 'no-cache, no-store, must-revalidate',
                'Pragma' => 'no-cache',
                'Expires' => '0'
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching all content: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch content'], 500);
        }
    }

    // FUNGSI UNTUK MENYIMPAN PENGATURAN TEKS & GAMBAR
    public function updateSettings(Request $request)
    {
        try {
            Log::info('Update settings request data:', $request->all());
            
            // Validasi input
            $request->validate([
                'hero_tagline' => 'nullable|string|max:500',
                'about_text' => 'nullable|string|max:2000',
                'gmaps_url' => 'nullable|string|max:1000', // Ubah dari url ke string
                'about_image_path' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            ]);

            $data = $request->except(['_token']);
            
            foreach ($data as $key => $value) {
                // Jika ini adalah file upload
                if ($request->hasFile($key)) {
                    // Hapus gambar lama jika ada
                    $oldSetting = Setting::where('key', $key)->first();
                    if ($oldSetting && $oldSetting->value && Storage::disk('public')->exists($oldSetting->value)) {
                        Storage::disk('public')->delete($oldSetting->value);
                    }
                    
                    // Upload gambar baru
                    $path = $request->file($key)->store('images/website', 'public');
                    Setting::updateOrCreate(['key' => $key], ['value' => $path]);
                    Log::info("File {$key} uploaded to: {$path}");
                } else {
                    // Jika ini adalah teks biasa (termasuk string kosong)
                    Setting::updateOrCreate(['key' => $key], ['value' => $value ?? '']);
                    Log::info("Setting {$key} updated to: " . ($value ?? 'empty'));
                }
            }
            
            // Clear cache setelah update
            Cache::forget('website_content');
            
            return response()->json([
                'success' => true, 
                'message' => 'Pengaturan berhasil disimpan.',
                'updated_settings' => $data
            ]);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak valid.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error updating settings: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan pengaturan: ' . $e->getMessage()
            ], 500);
        }
    }

    // FUNGSI UNTUK HERO IMAGE (Multiple Images)
    public function storeHeroImage(Request $request) {
        try {
            $request->validate([
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048'
            ]);
            
            // Cek jumlah hero images yang sudah ada
            $existingCount = HeroImage::count();
            if ($existingCount >= 5) {
                return response()->json([
                    'success' => false,
                    'message' => 'Maksimal 5 gambar hero. Hapus salah satu terlebih dahulu.'
                ], 422);
            }
            
            $path = $request->file('image')->store('images/hero', 'public');
            $image = HeroImage::create(['path' => $path]);
            
            Log::info("Hero image uploaded: {$path}");
            
            // Clear cache setelah update
            Cache::forget('website_content');
            
            return response()->json([
                'success' => true,
                'message' => 'Gambar hero berhasil ditambahkan.',
                'data' => $image
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak valid.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error storing hero image: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal menambah gambar hero: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroyHeroImage($id) {
        try {
            $heroImage = HeroImage::findOrFail($id);
            
            // Hapus file dari storage
            if (Storage::disk('public')->exists($heroImage->path)) {
                Storage::disk('public')->delete($heroImage->path);
            }
            
            $heroImage->delete();
            
            Log::info("Hero image deleted: {$heroImage->path}");
            
            // Clear cache setelah update
            Cache::forget('website_content');
            
            return response()->json([
                'success' => true, 
                'message' => 'Gambar hero berhasil dihapus.'
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting hero image: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus gambar hero: ' . $e->getMessage()
            ], 500);
        }
    }

    // FUNGSI GALERI
    public function storeGalleryImage(Request $request) {
        try {
            $request->validate([
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                'alt_text' => 'nullable|string|max:255'
            ]);
            
            $path = $request->file('image')->store('images/gallery', 'public');
            $galleryImage = GalleryImage::create([
                'path' => $path, 
                'alt_text' => $request->alt_text ?: 'Galeri Kanagara Coffee'
            ]);
            
            Log::info("Gallery image uploaded: {$path}");
            
            // Clear cache setelah update
            Cache::forget('website_content');
            
            return response()->json([
                'success' => true,
                'message' => 'Gambar galeri berhasil ditambahkan.',
                'data' => $galleryImage
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak valid.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error storing gallery image: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal menambah gambar galeri: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroyGalleryImage($id) {
        try {
            $galleryImage = GalleryImage::findOrFail($id);
            
            // Hapus file dari storage
            if (Storage::disk('public')->exists($galleryImage->path)) {
                Storage::disk('public')->delete($galleryImage->path);
            }
            
            $galleryImage->delete();
            
            Log::info("Gallery image deleted: {$galleryImage->path}");
            
            // Clear cache setelah update
            Cache::forget('website_content');
            
            return response()->json([
                'success' => true, 
                'message' => 'Gambar galeri berhasil dihapus.'
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting gallery image: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus gambar galeri: ' . $e->getMessage()
            ], 500);
        }
    }

    // FUNGSI FASILITAS
    public function storeFacility(Request $request) {
        try {
            $request->validate([
                'name' => 'required|string|max:255|unique:facilities'
            ]);
            
            $facility = Facility::create([
                'name' => $request->name, 
                'is_active' => true
            ]);
            
            Log::info("Facility created: {$request->name}");
            
            // Clear cache setelah update
            Cache::forget('website_content');
            
            return response()->json([
                'success' => true,
                'message' => 'Fasilitas berhasil ditambahkan.',
                'data' => $facility
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak valid.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error storing facility: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal menambah fasilitas: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updateFacility(Request $request, $id) {
        try {
            $request->validate([
                'is_active' => 'required|boolean'
            ]);
            
            $facility = Facility::findOrFail($id);
            $facility->update(['is_active' => $request->is_active]);
            
            Log::info("Facility {$facility->name} status changed to: " . ($request->is_active ? 'active' : 'inactive'));
            
            // Clear cache setelah update
            Cache::forget('website_content');
            
            return response()->json([
                'success' => true,
                'message' => 'Status fasilitas berhasil diubah.',
                'data' => $facility
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating facility: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengubah status fasilitas: ' . $e->getMessage()
            ], 500);
        }
    }
}