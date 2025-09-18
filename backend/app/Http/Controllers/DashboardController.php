<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Feedback;
use App\Models\Menu;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function getStats()
    {
        // Menghitung jumlah reservasi untuk hari ini
        $reservationsToday = Reservation::whereDate('date', Carbon::today())->count();

        // Mencari menu yang ditandai sebagai "Best Seller"
        $bestSellerMenu = Menu::where('tag', 'Best Seller')->first();

        // Menghitung rating rata-rata dari semua feedback
        $averageRating = Feedback::avg('cafeRating');

        // Mengambil data reservasi yang akan datang untuk kalender
        $reservationsCalendar = Reservation::where('status', '!=', 'Ditolak')
                                            ->where('status', '!=', 'Selesai')
                                            ->select('id', 'name', 'date', 'time')
                                            ->get();

        return response()->json([
            'reservationsToday' => $reservationsToday,
            'bestSellerMenu' => $bestSellerMenu ? $bestSellerMenu->name : 'Belum diatur',
            'averageRating' => number_format($averageRating, 1),
            'reservations' => $reservationsCalendar
        ]);
    }
}