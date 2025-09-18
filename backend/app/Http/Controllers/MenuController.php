<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class MenuController extends Controller
{
    /**
     * Menampilkan semua data menu.
     */
    public function index()
    {
        $menus = Menu::all();
        return response()->json([
            'success' => true,
            'message' => 'Daftar semua menu.',
            'data' => $menus
        ], 200);
    }

    /**
     * Menyimpan menu baru.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category' => 'required|string',
            'price' => 'required|string',
            'description' => 'nullable|string',
            'tag' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $image_path = null;
        if ($request->hasFile('image')) {
            // Simpan gambar ke public/images/menus dan dapatkan path-nya
            $image_path = $request->file('image')->store('images/menus', 'public');
        }

        $menu = Menu::create([
            'name' => $request->name,
            'category' => $request->category,
            'price' => $request->price,
            'description' => $request->description,
            'tag' => $request->tag ?? 'None', // <-- PERUBAHAN DI SINI
            'image_path' => $image_path,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Menu berhasil dibuat.',
            'data' => $menu
        ], 201);
    }

    /**
     * Menampilkan satu menu spesifik.
     */
    public function show(Menu $menu)
    {
        // Laravel's route model binding akan otomatis mencari menu berdasarkan ID
        // Jika tidak ditemukan, akan otomatis menghasilkan 404 Not Found
        return response()->json([
            'success' => true,
            'message' => 'Detail menu.',
            'data' => $menu
        ], 200);
    }

    /**
     * Memperbarui menu yang ada.
     */
    public function update(Request $request, Menu $menu)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category' => 'required|string',
            'price' => 'required|string',
            'description' => 'nullable|string',
            'tag' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $menuData = $request->except('image');

        if ($request->hasFile('image')) {
            // Hapus gambar lama jika ada
            if ($menu->image_path) {
                Storage::disk('public')->delete($menu->image_path);
            }
            // Simpan gambar baru
            $menuData['image_path'] = $request->file('image')->store('images/menus', 'public');
        }
        
        $menu->update($menuData);

        return response()->json([
            'success' => true,
            'message' => 'Menu berhasil diperbarui.',
            'data' => $menu
        ], 200);
    }

    /**
     * Menghapus menu.
     */
    public function destroy(Menu $menu)
    {
        // Hapus gambar dari storage
        if ($menu->image_path) {
            Storage::disk('public')->delete($menu->image_path);
        }

        // Hapus data dari database
        $menu->delete();

        return response()->json([
            'success' => true,
            'message' => 'Menu berhasil dihapus.'
        ], 200);
    }
}