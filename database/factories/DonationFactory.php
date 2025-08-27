<?php

namespace Database\Factories;

use App\Models\Donation;
use App\Models\Donor;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Donation>
 */
class DonationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Donation>
     */
    protected $model = Donation::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'donor_id' => Donor::factory(),
            'amount' => $this->faker->randomFloat(2, 50000, 1000000), // 50k to 1M IDR
            'notes' => $this->faker->optional(0.3)->sentence(),
            'proof_of_payment_path' => $this->faker->optional(0.4)->randomElement([
                'proof-of-payments/sample-receipt.jpg',
                'proof-of-payments/bank-transfer.png',
                'proof-of-payments/payment-proof.pdf'
            ]),
            'status' => $this->faker->randomElement(['confirmed', 'confirmed', 'confirmed', 'pending']), // More confirmed
            'donation_date' => $this->faker->dateTimeBetween('-2 years', 'now')->format('Y-m-d'),
        ];
    }
}