<?php

namespace App\Http\Controllers;

class PrinterController extends Controller
{

    public function index()
    {
        return view('printers', ['title' => 'Spisak štampača']);
    }
}
