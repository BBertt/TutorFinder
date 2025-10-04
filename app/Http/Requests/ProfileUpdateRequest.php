<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'profileImage' => ['nullable', 'image', 'mimes:jpg,jpeg,png'],
            'firstName' => ['required', 'string'],
            'lastName' => ['required', 'string'],
            'phoneNumber' => ['nullable', 'string', 'regex:/^[0-9]+$/'],
            'dateOfBirth' => ['nullable', 'date', 'before_or_equal:today'],
            'bio' => ['nullable', 'string']
        ];
    }
}
