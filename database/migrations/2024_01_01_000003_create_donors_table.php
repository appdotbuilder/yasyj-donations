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
        Schema::create('donors', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('whatsapp_number');
            $table->enum('membership_category', ['Yayasan', 'PCNU', 'MWCNU', 'Umum'])->default('Umum');
            $table->decimal('total_donations', 15, 2)->default(0)->comment('Total donated amount');
            $table->integer('donation_count')->default(0)->comment('Number of donations made');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('full_name');
            $table->index('membership_category');
            $table->index(['total_donations', 'donation_count']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donors');
    }
};