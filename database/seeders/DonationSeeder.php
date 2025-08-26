<?php

namespace Database\Seeders;

use App\Models\Donation;
use App\Models\DonationInquiry;
use App\Models\Donor;
use Illuminate\Database\Seeder;

class DonationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create donors with donations
        $donors = Donor::factory(50)->create();
        
        // Create donations for these donors
        $donors->each(function (Donor $donor) {
            $donationCount = random_int(1, 8); // Each donor has 1-8 donations
            
            Donation::factory($donationCount)->create([
                'donor_id' => $donor->id,
            ]);
        });
        
        // Update donor totals
        $donors->each(function (Donor $donor) {
            $donor->updateTotals();
        });
        
        // Create some donation inquiries
        DonationInquiry::factory(20)->create();
    }
}