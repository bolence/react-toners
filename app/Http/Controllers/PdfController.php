<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Barryvdh\Snappy\Facades\SnappyPdf as PDF;

class PdfController extends Controller
{
    public function index()
    {

        $orders = Order::with('printer', 'user.account')
                    ->whereRaw('MONTH(created_at) = ' . date('m'))
                    ->whereRaw('YEAR(created_at) = ' . date('Y'))
                    ->orderByDesc('id')
                    ->get();

        return PDF::loadView('pdf.porudzbenica', ['orders' => $orders])
                    ->setPaper('a4')
                    ->setOrientation('landscape')
                    ->setOption('footer-right', 'Stranica [page] od [toPage]')
                    ->setOption('footer-left', 'Kreiran ' . date('d.m.Y H:i'))
                    ->download('spisak_porucenih_tonera_za_' .date('m'). '.pdf');
    }
}
