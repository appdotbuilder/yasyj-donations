<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDonationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'donor_id' => ['required', 'exists:donors,id'],
            'amount' => ['required', 'numeric', 'min:1000'],
            'notes' => ['nullable', 'string', 'max:500'],
            'status' => ['required', Rule::in(['pending', 'confirmed', 'cancelled'])],
            'donation_date' => ['required', 'date'],
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'donor_id.required' => 'Donatur harus dipilih.',
            'donor_id.exists' => 'Donatur tidak valid.',
            'amount.required' => 'Jumlah donasi harus diisi.',
            'amount.numeric' => 'Jumlah donasi harus berupa angka.',
            'amount.min' => 'Jumlah donasi minimal Rp 1.000.',
            'notes.max' => 'Catatan tidak boleh lebih dari 500 karakter.',
            'status.required' => 'Status donasi harus dipilih.',
            'status.in' => 'Status donasi tidak valid.',
            'donation_date.required' => 'Tanggal donasi harus diisi.',
            'donation_date.date' => 'Tanggal donasi tidak valid.',
        ];
    }
}