<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDonorRequest;
use App\Http\Requests\UpdateDonorRequest;
use App\Models\Donor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DonorController extends Controller
{
    /**
     * Display a listing of the donors.
     */
    public function index(Request $request)
    {
        $query = Donor::with('donations');
        
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('full_name', 'like', '%' . $request->search . '%')
                  ->orWhere('whatsapp_number', 'like', '%' . $request->search . '%');
            });
        }
        
        if ($request->has('category') && $request->category && $request->category !== 'all') {
            $query->where('membership_category', $request->category);
        }
        
        $donors = $query->orderBy('total_donations', 'desc')
                       ->paginate(15)
                       ->withQueryString();
        
        return Inertia::render('donors/index', [
            'donors' => $donors,
            'categories' => Donor::getMembershipCategories(),
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    /**
     * Show the form for creating a new donor.
     */
    public function create()
    {
        return Inertia::render('donors/create', [
            'categories' => Donor::getMembershipCategories(),
        ]);
    }

    /**
     * Store a newly created donor.
     */
    public function store(StoreDonorRequest $request)
    {
        $donor = Donor::create($request->validated());

        return redirect()->route('donors.show', $donor)
            ->with('success', 'Donor berhasil ditambahkan.');
    }

    /**
     * Display the specified donor.
     */
    public function show(Donor $donor)
    {
        $donor->load(['donations' => function ($query) {
            $query->orderBy('donation_date', 'desc');
        }]);
        
        return Inertia::render('donors/show', [
            'donor' => $donor,
        ]);
    }

    /**
     * Show the form for editing the donor.
     */
    public function edit(Donor $donor)
    {
        return Inertia::render('donors/edit', [
            'donor' => $donor,
            'categories' => Donor::getMembershipCategories(),
        ]);
    }

    /**
     * Update the specified donor.
     */
    public function update(UpdateDonorRequest $request, Donor $donor)
    {
        $donor->update($request->validated());

        return redirect()->route('donors.show', $donor)
            ->with('success', 'Data donor berhasil diperbarui.');
    }

    /**
     * Remove the specified donor.
     */
    public function destroy(Donor $donor)
    {
        $donor->delete();

        return redirect()->route('donors.index')
            ->with('success', 'Donor berhasil dihapus.');
    }
}