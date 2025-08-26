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
        Schema::create('donations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('donor_id')->constrained()->onDelete('cascade');
            $table->decimal('amount', 15, 2);
            $table->text('notes')->nullable();
            $table->enum('status', ['pending', 'confirmed', 'cancelled'])->default('confirmed');
            $table->date('donation_date');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('donor_id');
            $table->index('donation_date');
            $table->index('status');
            $table->index(['donation_date', 'status']);
            $table->index(['donor_id', 'donation_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donations');
    }
};