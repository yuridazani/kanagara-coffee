<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MenuRating extends Model
{
    use HasFactory;

    protected $fillable = [
        'feedback_id',
        'menuName',
        'rating',
    ];

    /**
     * Get the feedback that owns the MenuRating
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function feedback(): BelongsTo
    {
        return $this->belongsTo(Feedback::class);
    }
}