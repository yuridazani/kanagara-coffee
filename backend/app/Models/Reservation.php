<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'whatsapp',
        'date',
        'time',
        'people',
        'type',
        'area',
        'eventDetails',
        'reservationNumber',
        'status',
        'dp_proof_path', // Make sure this is included!
        'rescheduleHistory',
        'selectedMenus'
    ];

    protected $casts = [
        'rescheduleHistory' => 'array',
        'selectedMenus' => 'array',
    ];

    public function selectedMenus()
    {
        return $this->hasMany(ReservationMenu::class);
    }
}