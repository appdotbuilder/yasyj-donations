<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
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
            'email' => ['required', 'string'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        $credential = $this->input('email');
        $password = $this->input('password');
        
        // Try to authenticate with different credential types
        $attempts = [];
        
        // If it looks like an email
        if (filter_var($credential, FILTER_VALIDATE_EMAIL)) {
            $attempts[] = ['email' => $credential, 'password' => $password];
        }
        
        // If it looks like a phone number (contains only digits, +, -, spaces, parentheses)
        if (preg_match('/^[\d\+\-\s\(\)]+$/', $credential)) {
            // Clean the phone number (remove spaces, dashes, parentheses)
            $cleanedNumber = preg_replace('/[\s\-\(\)]/', '', $credential);
            $attempts[] = ['whatsapp_number' => $cleanedNumber, 'password' => $password];
            $attempts[] = ['whatsapp_number' => $credential, 'password' => $password];
        }
        
        // Always try as username (name field)
        $attempts[] = ['name' => $credential, 'password' => $password];
        
        // Try each authentication method
        foreach ($attempts as $credentials) {
            if (Auth::attempt($credentials, $this->boolean('remember'))) {
                RateLimiter::clear($this->throttleKey());
                return;
            }
        }

        RateLimiter::hit($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => __('auth.failed'),
        ]);
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => __('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('email')).'|'.$this->ip());
    }
}
