<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\Donation
 *
 * @property int $id
 * @property int $donor_id
 * @property string $amount
 * @property string|null $notes
 * @property string|null $proof_of_payment_path
 * @property string $status
 * @property string $donation_date
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Donor $donor
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Donation newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Donation newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Donation query()
 * @method static \Illuminate\Database\Eloquent\Builder|Donation whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Donation whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Donation whereDonationDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Donation whereDonorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Donation whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Donation whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Donation whereProofOfPaymentPath($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Donation whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Donation whereUpdatedAt($value)
 * @method static \Database\Factories\DonationFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Donation extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'donor_id',
        'amount',
        'notes',
        'proof_of_payment_path',
        'status',
        'donation_date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'amount' => 'decimal:2',
        'donation_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the donor that owns the donation.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function donor(): BelongsTo
    {
        return $this->belongsTo(Donor::class);
    }

    /**
     * Boot the model.
     *
     * @return void
     */
    protected static function boot()
    {
        parent::boot();

        static::saved(function (Donation $donation) {
            $donation->donor->updateTotals();
        });

        static::deleted(function (Donation $donation) {
            $donation->donor->updateTotals();
        });
    }
}