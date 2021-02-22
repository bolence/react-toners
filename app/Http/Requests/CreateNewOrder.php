<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateNewOrder extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'printer' => 'required',
            'quantity' => 'required|integer'
        ];
    }

    public function messages()
    {
        return [
            'printer.required' => 'Niste izabrali štampač',
            'quantity.required' => 'Niste izabrali količinu'
        ];
    }
}