<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificationController extends Controller
{
    // Mengambil semua notifikasi untuk admin yang login
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Pastikan user ada
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }
        
        return response()->json([
            'read' => $user->readNotifications->take(10), // Batasi jumlah
            'unread' => $user->unreadNotifications->take(10),
        ]);
    }

    // Menandai notifikasi sebagai sudah dibaca
    public function markAsRead(Request $request, $notificationId)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }
        
        $notification = $user->notifications()->find($notificationId);
        
        if ($notification) {
            $notification->markAsRead();
            return response()->json(['success' => true]);
        }
        
        return response()->json(['error' => 'Notification not found'], 404);
    }

    public function test(Request $request)
{
    $user = $request->user();
    
    if (!$user) {
        return response()->json(['error' => 'User not authenticated'], 401);
    }
    
    // Test creating a manual notification
    try {
        $user->notify(new \App\Notifications\NewReservation((object)[
            'id' => 999,
            'name' => 'Test User',
            'date' => now()->format('Y-m-d'),
            'time' => now()->format('H:i'),
            'reservationNumber' => 'TEST-123'
        ]));
        
        return response()->json(['success' => 'Test notification sent']);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()]);
    }
}
}