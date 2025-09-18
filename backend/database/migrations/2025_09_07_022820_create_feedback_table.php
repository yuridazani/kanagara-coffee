<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
public function up(): void
{
    Schema::create('feedback', function (Blueprint $table) {
        $table->id();
        $table->string('name')->nullable();
        $table->date('visitDate');
        $table->time('visitTime');
        $table->string('photo_path')->nullable(); // <-- PERUBAHAN DI SINI
        $table->integer('cafeRating');
        $table->text('cafeComment');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('feedback');
    }
};
