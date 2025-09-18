<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\WebsiteContentController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\DashboardController;

// RUTE PUBLIK (Tidak perlu login)
// ===================================
Route::post('/register', [AuthController::class, 'register']); // Registrasi (bisa dihapus jika admin hanya 1)
Route::post('/login', [AuthController::class, 'login']);

Route::get('/menus', [MenuController::class, 'index']);
Route::get('/menus/{menu}', [MenuController::class, 'show']);

Route::post('/reservations', [ReservationController::class, 'store']); // Pelanggan membuat reservasi
Route::post('/feedback', [FeedbackController::class, 'store']); // Pelanggan mengirim feedback
Route::get('/feedback', [FeedbackController::class, 'index']); // DIPINDAH KE SINI - Publik bisa lihat feedback
Route::post('/reservations/search', [ReservationController::class, 'search']);
Route::post('/reservations/{reservation}/select-menus', [ReservationController::class, 'selectMenus']);
Route::post('/reservations/{reservation}/upload-dp', [ReservationController::class, 'uploadDp']);

Route::get('/content/all', [WebsiteContentController::class, 'getAllContent']);

// RUTE TERLINDUNGI (Wajib login sebagai admin)
// ==============================================
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/user/change-password', [AuthController::class, 'changePassword']);

    // Manajemen Menu oleh Admin
    Route::post('/menus', [MenuController::class, 'store']);
    Route::put('/menus/{menu}', [MenuController::class, 'update']);
    Route::delete('/menus/{menu}', [MenuController::class, 'destroy']);

    // Manajemen Reservasi oleh Admin
    Route::get('/reservations', [ReservationController::class, 'index']);
    Route::get('/reservations/{reservation}', [ReservationController::class, 'show']);
    Route::put('/reservations/{reservation}', [ReservationController::class, 'update']);
    Route::delete('/reservations/{reservation}', [ReservationController::class, 'destroy']);

    // Manajemen Feedback oleh Admin (hanya untuk detail dan hapus)
    Route::get('/feedback/{feedback}', [FeedbackController::class, 'show']);
    Route::delete('/feedback/{feedback}', [FeedbackController::class, 'destroy']);

    // ========== RUTE KELOLA WEBSITE ==========
    // Settings (Hero tagline, About text, Maps, etc)
    Route::post('/content/settings', [WebsiteContentController::class, 'updateSettings']);
    
    // Hero Images
    Route::post('/hero-images', [WebsiteContentController::class, 'storeHeroImage']);
    Route::delete('/hero-images/{heroImage}', [WebsiteContentController::class, 'destroyHeroImage']);
    
    // Gallery Images
    Route::post('/gallery', [WebsiteContentController::class, 'storeGalleryImage']);
    Route::delete('/gallery/{galleryImage}', [WebsiteContentController::class, 'destroyGalleryImage']);
    
    // Facilities
    Route::post('/facilities', [WebsiteContentController::class, 'storeFacility']);
    Route::put('/facilities/{facility}', [WebsiteContentController::class, 'updateFacility']);

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{notificationId}/read', [NotificationController::class, 'markAsRead']);
    
    Route::get('/dashboard/stats', [DashboardController::class, 'getStats']);

});