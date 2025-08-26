<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDonationInquiryRequest;
use App\Models\Donation;
use App\Models\DonationInquiry;
use App\Models\Donor;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DonationController extends Controller
{
    /**
     * Display the public donation statistics page.
     */
    public function index()
    {
        $currentMonth = Carbon::now()->startOfMonth();
        
        // Get statistics
        $totalDonors = Donor::count();
        $donorsThisMonth = Donor::where('created_at', '>=', $currentMonth)->count();
        
        $totalDonations = Donation::where('status', 'confirmed')->sum('amount');
        $donationsThisMonth = Donation::where('status', 'confirmed')
            ->where('donation_date', '>=', $currentMonth)
            ->sum('amount');
        
        // Get donation growth data for last 12 months
        $donationGrowth = [];
        $donorGrowth = [];
        
        for ($i = 11; $i >= 0; $i--) {
            $monthStart = Carbon::now()->subMonths($i)->startOfMonth();
            $monthEnd = Carbon::now()->subMonths($i)->endOfMonth();
            
            $monthlyDonations = Donation::where('status', 'confirmed')
                ->whereBetween('donation_date', [$monthStart, $monthEnd])
                ->sum('amount');
                
            $monthlyDonors = Donor::whereBetween('created_at', [$monthStart, $monthEnd])
                ->count();
            
            $donationGrowth[] = [
                'month' => $monthStart->format('M Y'),
                'amount' => (float) $monthlyDonations,
            ];
            
            $donorGrowth[] = [
                'month' => $monthStart->format('M Y'),
                'count' => $monthlyDonors,
            ];
        }
        
        // Calculate average donation
        $totalDonationCount = Donation::where('status', 'confirmed')->count();
        $averageDonation = $totalDonationCount > 0 ? $totalDonations / $totalDonationCount : 0;
        
        return Inertia::render('welcome', [
            'statistics' => [
                'total_donors' => $totalDonors,
                'donors_this_month' => $donorsThisMonth,
                'total_donations' => (float) $totalDonations,
                'donations_this_month' => (float) $donationsThisMonth,
                'average_donation' => (float) $averageDonation,
            ],
            'donation_growth' => $donationGrowth,
            'donor_growth' => $donorGrowth,
        ]);
    }

    /**
     * Store a donation inquiry.
     */
    public function store(StoreDonationInquiryRequest $request)
    {
        DonationInquiry::create($request->validated());

        return redirect()->back()->with('success', 'Terima kasih atas minat Anda! Tim kami akan menghubungi Anda segera.');
    }
}