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
        $id = null;

        if ($this->route('user')) {
            $id = $this->route('user')->id;
        } else {
            $id = auth()->user()->id;
        }

        return [
            'profileImage' => ['nullable', 'image', 'mimes:jpg,jpeg,png'],
            'firstName' => ['required', 'string'],
            'lastName' => ['required', 'string'],
            'phoneNumber' => ['nullable', 'string', 'regex:/^[0-9]+$/', 'unique:users,phone_number,'. $id],
            'dateOfBirth' => ['nullable', 'date', 'before_or_equal:today'],
            'bio' => ['nullable', 'string']
        ];
    }
}
