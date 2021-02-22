<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        return view('home', ['title' => 'Dashboard']);
    }

    /**
     * Undocumented function
     *
     * @return void
     */
    public function limits()
    {
        if( ! Auth::user()->isAdmin())
        {
            abort(403);
        }
        return view('limits', ['title' => 'Limiti']);
    }
}
