<?php

namespace Database\Factories;

use App\Models\Donor;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Donor>
 */
class DonorFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Donor>
     */
    protected $model = Donor::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'full_name' => $this->faker->name(),
            'whatsapp_number' => '0' . $this->faker->numerify('8##-####-####'),
            'membership_category' => $this->faker->randomElement(['Yayasan', 'PCNU', 'MWCNU', 'Umum']),
            'total_donations' => 0,
            'donation_count' => 0,
        ];
    }
}