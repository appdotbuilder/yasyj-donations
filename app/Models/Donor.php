<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Donor
 *
 * @property int $id
 * @property string $full_name
 * @property string $whatsapp_number
 * @property string $membership_category
 * @property string $total_donations
 * @property int $donation_count
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Donation> $donations
 * @property-read int|null $donations_count
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Donor newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Donor newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Donor query()
 * @method static \Illuminate\Database\Eloquent\Builder|Donor whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Donor whereDonationCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Donor whereFullName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Donor whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Donor whereMembershipCategory($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Donor whereTotalDonations($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Donor whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Donor whereWhatsappNumber($value)
 * @method static \Database\Factories\DonorFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Donor extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'full_name',
        'whatsapp_number',
        'membership_category',
        'total_donations',
        'donation_count',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'total_donations' => 'decimal:2',
        'donation_count' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the donations for the donor.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function donations(): HasMany
    {
        return $this->hasMany(Donation::class);
    }

    /**
     * Update donor totals based on donations.
     *
     * @return void
     */
    public function updateTotals(): void
    {
        $totals = $this->donations()
            ->where('status', 'confirmed')
            ->selectRaw('SUM(amount) as total_amount, COUNT(*) as total_count')
            ->first();

        $this->update([
            'total_donations' => $totals->total_amount ?? 0,
            'donation_count' => $totals->total_count ?? 0,
        ]);
    }

    /**
     * Get the membership category options.
     *
     * @return array<string>
     */
    public static function getMembershipCategories(): array
    {
        return ['Yayasan', 'PCNU', 'MWCNU', 'Umum'];
    }
}