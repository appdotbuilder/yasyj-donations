<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDonationInquiryRequest;
use App\Models\DonationInquiry;

class DonationInquiryController extends Controller
{
    /**
     * Store a newly created donation inquiry in storage.
     */
    public function store(StoreDonationInquiryRequest $request)
    {
        DonationInquiry::create($request->validated());

        return redirect()->back()->with('success', 'Terima kasih atas minat Anda! Tim kami akan menghubungi Anda segera.');
    }
}