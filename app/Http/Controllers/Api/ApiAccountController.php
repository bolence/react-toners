<?php

namespace App\Http\Controllers\Api;

use App\Models\Account;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ApiAccountController extends Controller
{
    public function index()
    {
        return response()->json(Account::all());
    }
}
