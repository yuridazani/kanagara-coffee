<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Feedback extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'visitDate',
        'visitTime',
        'photo_path',
        'cafeRating',
        'cafeComment',
    ];

    /**
     * Get all of the menuRatings for the Feedback
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function menuRatings(): HasMany
    {
        return $this->hasMany(MenuRating::class);
    }
    // Di dalam class Feedback
    public function photos()
    {
        return $this->hasMany(FeedbackPhoto::class);
    }
}