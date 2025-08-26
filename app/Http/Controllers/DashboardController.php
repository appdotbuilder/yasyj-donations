<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Donation;
use App\Models\DonationInquiry;
use App\Models\Donor;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index()
    {
        $currentMonth = Carbon::now()->startOfMonth();
        
        // Basic statistics
        $totalDonors = Donor::count();
        $donorsThisMonth = Donor::where('created_at', '>=', $currentMonth)->count();
        
        $totalDonations = Donation::where('status', 'confirmed')->sum('amount');
        $donationsThisMonth = Donation::where('status', 'confirmed')
            ->where('donation_date', '>=', $currentMonth)
            ->sum('amount');
        
        // Recent donations (last 10)
        $recentDonations = Donation::with('donor')
            ->where('status', 'confirmed')
            ->orderBy('donation_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();
        
        // Top donors by total donation amount
        $topDonors = Donor::where('total_donations', '>', 0)
            ->orderBy('total_donations', 'desc')
            ->take(10)
            ->get();
        
        // Donation inquiries
        $newInquiries = DonationInquiry::where('status', 'new')->count();
        $totalInquiries = DonationInquiry::count();
        
        // Monthly donation trends (last 6 months)
        $monthlyTrends = [];
        for ($i = 5; $i >= 0; $i--) {
            $monthStart = Carbon::now()->subMonths($i)->startOfMonth();
            $monthEnd = Carbon::now()->subMonths($i)->endOfMonth();
            
            $monthlyAmount = Donation::where('status', 'confirmed')
                ->whereBetween('donation_date', [$monthStart, $monthEnd])
                ->sum('amount');
            
            $monthlyCount = Donation::where('status', 'confirmed')
                ->whereBetween('donation_date', [$monthStart, $monthEnd])
                ->count();
            
            $monthlyTrends[] = [
                'month' => $monthStart->format('M Y'),
                'amount' => (float) $monthlyAmount,
                'count' => $monthlyCount,
            ];
        }
        
        // Category breakdown
        $categoryBreakdown = Donor::selectRaw('membership_category, COUNT(*) as count, SUM(total_donations) as total_amount')
            ->groupBy('membership_category')
            ->get();
        
        return Inertia::render('dashboard', [
            'statistics' => [
                'total_donors' => $totalDonors,
                'donors_this_month' => $donorsThisMonth,
                'total_donations' => (float) $totalDonations,
                'donations_this_month' => (float) $donationsThisMonth,
                'new_inquiries' => $newInquiries,
                'total_inquiries' => $totalInquiries,
            ],
            'recent_donations' => $recentDonations,
            'top_donors' => $topDonors,
            'monthly_trends' => $monthlyTrends,
            'category_breakdown' => $categoryBreakdown,
        ]);
    }
}