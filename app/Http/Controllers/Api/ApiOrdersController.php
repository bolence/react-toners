<?php

namespace App\Http\Controllers\Api;

use App\Models\Order;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Auth;

class ApiOrdersController extends Controller
{

    public function index(Request $request)
    {

        $year = date('Y');
        $user = Auth::user();
        $month = request()->month;

        $orders = Order::when($month, function($q) use($month) {
            $q->where('month', '=', $month);
        })->with('account', 'printer')->where('account_id', '=', $user->account_id)
        ->whereYear('created_at', '=', $year)
        ->get();

        return response()->json([
            'orders' => $orders,
            'orders_count' => $orders->count(),
            'title' => "Poručeni toneri " . $user->account->sluzba . " u $year . godini"
        ]);
    }
}
