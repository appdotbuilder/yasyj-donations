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
        Schema::create('donation_inquiries', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('whatsapp_number');
            $table->enum('status', ['new', 'contacted', 'converted', 'declined'])->default('new');
            $table->text('notes')->nullable();
            $table->timestamp('contacted_at')->nullable();
            $table->foreignId('converted_donor_id')->nullable()->constrained('donors')->onDelete('set null');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('status');
            $table->index('created_at');
            $table->index('contacted_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donation_inquiries');
    }
};