<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class TutorRegisterRequest extends FormRequest
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
            'email' => ['required', 'string', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'regex:/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/'],
            'confirmPassword' => ['required', 'string', 'same:password'],
            'phoneNumber' => ['required', 'string', 'regex:/^[0-9]+$/', 'unique:users,phone_number'],
            'gender' => ['required', 'string'],
            'dateOfBirth' => ['required', 'date', 'before_or_equal:today'],
            'identificationImage' => ['required', 'image', 'mimes:jpg,jpeg,png'],
            'certificationImage' => ['required', 'image', 'mimes:jpg,jpeg,png']
        ];
    }
}
