<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\DonationInquiry
 *
 * @property int $id
 * @property string $name
 * @property string $whatsapp_number
 * @property string $status
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $contacted_at
 * @property int|null $converted_donor_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Donor|null $convertedDonor
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|DonationInquiry newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DonationInquiry newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DonationInquiry query()
 * @method static \Illuminate\Database\Eloquent\Builder|DonationInquiry whereContactedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DonationInquiry whereConvertedDonorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DonationInquiry whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DonationInquiry whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DonationInquiry whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DonationInquiry whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DonationInquiry whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DonationInquiry whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DonationInquiry whereWhatsappNumber($value)
 * @method static \Database\Factories\DonationInquiryFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class DonationInquiry extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'whatsapp_number',
        'status',
        'notes',
        'contacted_at',
        'converted_donor_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'contacted_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the converted donor.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function convertedDonor(): BelongsTo
    {
        return $this->belongsTo(Donor::class, 'converted_donor_id');
    }
}