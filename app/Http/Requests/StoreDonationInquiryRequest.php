<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDonationInquiryRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'whatsapp_number' => 'required|string|max:20|regex:/^[\d\+\-\s\(\)]+$/',
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
            'name.required' => 'Nama lengkap harus diisi.',
            'name.max' => 'Nama tidak boleh lebih dari 255 karakter.',
            'whatsapp_number.required' => 'Nomor WhatsApp harus diisi.',
            'whatsapp_number.regex' => 'Format nomor WhatsApp tidak valid.',
            'whatsapp_number.max' => 'Nomor WhatsApp tidak boleh lebih dari 20 karakter.',
        ];
    }
}