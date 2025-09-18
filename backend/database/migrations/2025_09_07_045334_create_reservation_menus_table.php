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
    Schema::create('reservation_menus', function (Blueprint $table) {
        $table->id();
        $table->foreignId('reservation_id')->constrained()->onDelete('cascade');
        $table->string('menu_name');
        $table->integer('quantity');
        $table->string('price');
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
        Schema::dropIfExists('reservation_menus');
    }
};
