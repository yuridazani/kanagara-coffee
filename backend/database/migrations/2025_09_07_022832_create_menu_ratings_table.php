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
            Schema::create('menu_ratings', function (Blueprint $table) {
                $table->id();
                $table->foreignId('feedback_id')->constrained()->onDelete('cascade');
                $table->string('menuName');
                $table->integer('rating');
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
        Schema::dropIfExists('menu_ratings');
    }
};
