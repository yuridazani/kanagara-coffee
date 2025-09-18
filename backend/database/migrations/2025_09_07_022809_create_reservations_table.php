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
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->string('reservationNumber')->unique();
            $table->string('name');
            $table->string('whatsapp');
            $table->date('date');
            $table->time('time');
            $table->integer('people');
            $table->string('type'); // 'meja' atau 'event'
            $table->string('area')->nullable(); // 'indoor', 'outdoor', 'vip'
            $table->text('eventDetails')->nullable();
            $table->string('status')->default('Menunggu Konfirmasi');
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
        Schema::dropIfExists('reservations');
    }
};
