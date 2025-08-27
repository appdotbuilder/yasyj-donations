<?php

use App\Models\Donation;
use App\Models\DonationInquiry;
use App\Models\Donor;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('public donation page displays statistics', function () {
    // Create test data
    $donor = Donor::factory()->create();
    Donation::factory(3)->create(['donor_id' => $donor->id]);
    
    $response = $this->get('/');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('welcome')
        ->has('statistics')
        ->has('donation_growth')
        ->has('donor_growth')
    );
});

test('donation inquiry can be submitted', function () {
    $inquiryData = [
        'name' => 'John Doe',
        'whatsapp_number' => '08123456789',
    ];

    $response = $this->post('/donation-inquiry', $inquiryData);

    $response->assertRedirect();
    $this->assertDatabaseHas('donation_inquiries', $inquiryData);
});

test('donation inquiry requires valid data', function () {
    $response = $this->post('/donation-inquiry', []);

    $response->assertSessionHasErrors(['name', 'whatsapp_number']);
});

test('admin dashboard displays analytics', function () {
    $user = User::factory()->create();
    $donor = Donor::factory()->create();
    Donation::factory(5)->create(['donor_id' => $donor->id]);

    $response = $this->actingAs($user)->get('/dashboard');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('dashboard')
        ->has('statistics')
        ->has('recent_donations')
        ->has('top_donors')
        ->has('monthly_trends')
        ->has('category_breakdown')
    );
});

test('donors index page works', function () {
    $user = User::factory()->create();
    Donor::factory(5)->create();

    $response = $this->actingAs($user)->get('/donors');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('donors/index')
        ->has('donors.data')
    );
});

test('donor can be created', function () {
    $user = User::factory()->create();
    
    $donorData = [
        'full_name' => 'Jane Doe',
        'whatsapp_number' => '08123456789',
        'membership_category' => 'Umum',
    ];

    $response = $this->actingAs($user)
                     ->post('/donors', $donorData);

    $response->assertRedirect();
    $this->assertDatabaseHas('donors', $donorData);
});

test('donor can be updated', function () {
    $user = User::factory()->create();
    $donor = Donor::factory()->create();
    
    $updatedData = [
        'full_name' => 'Updated Name',
        'whatsapp_number' => '08987654321',
        'membership_category' => 'PCNU',
    ];

    $response = $this->actingAs($user)
                     ->put("/donors/{$donor->id}", $updatedData);

    $response->assertRedirect();
    $this->assertDatabaseHas('donors', array_merge(['id' => $donor->id], $updatedData));
});

test('donor show page displays donation history', function () {
    $user = User::factory()->create();
    $donor = Donor::factory()->create();
    Donation::factory(3)->create(['donor_id' => $donor->id]);

    $response = $this->actingAs($user)->get("/donors/{$donor->id}");

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('donors/show')
        ->has('donor')
        ->where('donor.id', $donor->id)
    );
});

test('donation can be created without proof of payment', function () {
    $user = User::factory()->create();
    $donor = Donor::factory()->create();
    
    $donationData = [
        'donor_id' => $donor->id,
        'amount' => 100000,
        'notes' => 'Test donation',
        'status' => 'confirmed',
        'donation_date' => '2024-01-15',
    ];

    $response = $this->actingAs($user)
                     ->post('/donations', $donationData);

    $response->assertRedirect();
    
    $donation = Donation::where('donor_id', $donor->id)
                        ->where('amount', 100000)
                        ->first();
    
    expect($donation)->not()->toBeNull();
    expect($donation->notes)->toBe('Test donation');
    expect($donation->status)->toBe('confirmed');
    expect($donation->proof_of_payment_path)->toBeNull();
});

test('donation can be created with proof of payment file', function () {
    $user = User::factory()->create();
    $donor = Donor::factory()->create();
    
    $file = \Illuminate\Http\UploadedFile::fake()->image('receipt.jpg', 800, 600);
    
    $donationData = [
        'donor_id' => $donor->id,
        'amount' => 150000,
        'notes' => 'Test donation with proof',
        'status' => 'confirmed',
        'donation_date' => '2024-01-15',
        'proof_of_payment' => $file,
    ];

    $response = $this->actingAs($user)
                     ->post('/donations', $donationData);

    $response->assertRedirect();
    
    $donation = Donation::where('donor_id', $donor->id)
                        ->where('amount', 150000)
                        ->first();
    
    expect($donation)->not()->toBeNull();
    expect($donation->proof_of_payment_path)->not()->toBeNull();
    expect($donation->proof_of_payment_path)->toContain('proof-of-payments/');
    
    // Check if file exists
    Storage::disk('public')->assertExists($donation->proof_of_payment_path);
});

test('donation creation validates file types', function () {
    $user = User::factory()->create();
    $donor = Donor::factory()->create();
    
    $invalidFile = \Illuminate\Http\UploadedFile::fake()->create('document.txt', 100, 'text/plain');
    
    $donationData = [
        'donor_id' => $donor->id,
        'amount' => 100000,
        'notes' => 'Test donation',
        'status' => 'confirmed',
        'donation_date' => '2024-01-15',
        'proof_of_payment' => $invalidFile,
    ];

    $response = $this->actingAs($user)
                     ->post('/donations', $donationData);

    $response->assertSessionHasErrors(['proof_of_payment']);
});