<?php namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Str;
use Barryvdh\Snappy\Facades\SnappyPdf as PDF;

class PDFCreator extends PDF  {

    public static function create_pdf($user)
    {

        $folder = storage_path("reports/users/$user->id/");
        $username = strtolower(Str::slug($user->name));
        $filename = $folder . 'porudzbenica_tonera_' . $username . '_' . date('m') . '_' . date('Y') . '.pdf';

        $orders = Order::with('user')->whereMonth('created_at', '=', date('m'))
                    ->where('user_id', '=', $user->id)
                    ->get();

        if(!$orders) return;

        parent::loadView("pdf.reports.user_orders" , ['orders' => $orders, 'user' => $user])
        ->setOrientation('landscape')
        ->setOption('footer-right', 'Stranica [page] od [toPage]')
        ->setOption('footer-left', 'Kreiran ' . date('d.m.Y H:i'))
        ->save($filename);

    }


}
