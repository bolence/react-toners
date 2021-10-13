<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

class PrinterController extends Controller
{

    public function index()
    {
        if( ! Auth::user()->isAdmin())
        {
            abort(403);
        }
        return view('printers', ['title' => 'Spisak štampača']);
    }
}
