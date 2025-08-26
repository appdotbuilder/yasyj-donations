<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

// Public donation statistics and inquiry form
Route::get('/', [App\Http\Controllers\DonationController::class, 'index'])->name('home');
Route::post('/donation-inquiry', [App\Http\Controllers\DonationController::class, 'store'])->name('donation-inquiry.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
    
    // Donor management routes
    Route::resource('donors', App\Http\Controllers\DonorController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
