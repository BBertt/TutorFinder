<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
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
            'firstName' => ['required', 'string'],
            'lastName' => ['required', 'string'],
            'email' => ['required', 'string', 'unique:users,email'],
            'password' => ['required', 'string'],
            'confirmPassword' => ['required', 'string', 'same:password'],
            'phoneNumber' => ['required', 'string', 'regex:/^[0-9]+$/'],
            'gender' => ['required', 'string'],
            'dateOfBirth' => ['required', 'date', 'before_or_equal:today']
        ];
    }
}
