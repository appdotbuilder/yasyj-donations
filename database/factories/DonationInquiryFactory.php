<?php

namespace Database\Factories;

use App\Models\DonationInquiry;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DonationInquiry>
 */
class DonationInquiryFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\DonationInquiry>
     */
    protected $model = DonationInquiry::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'whatsapp_number' => '0' . $this->faker->numerify('8##-####-####'),
            'status' => $this->faker->randomElement(['new', 'contacted', 'converted', 'declined']),
            'notes' => $this->faker->optional(0.4)->sentence(),
            'contacted_at' => $this->faker->optional(0.6)->dateTimeBetween('-1 month', 'now'),
            'converted_donor_id' => null,
        ];
    }
}