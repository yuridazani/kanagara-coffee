<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReservationMenu extends Model
{
    use HasFactory;
    protected $fillable = ['reservation_id', 'menu_name', 'quantity', 'price'];
}
