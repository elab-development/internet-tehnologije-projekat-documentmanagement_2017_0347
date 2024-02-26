<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::dropIfExists('employee');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('employee', function (Blueprint $table) {
            $table->string('email_fk');
            $table->string('name');
            $table->string('role');
            $table->string('department_fk');
        });
    }
};
