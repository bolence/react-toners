<?php namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Str;
use Barryvdh\Snappy\Facades\SnappyPdf as PDF;

class PDFCreator extends PDF  {

    public static function create_pdf_for_user($user)
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

    public static function create_pdf_for_summary_orders($orders)
    {
        $folder = storage_path("reports/");
        $filename = $folder . 'porudzbenica_tonera_za_' . date('m') . '_' . date('Y') . '.pdf';

        parent::loadView("pdf.porudzbenica" , ['orders' => $orders])
        ->setOrientation('landscape')
        ->setOption('footer-right', 'Stranica [page] od [toPage]')
        ->setOption('footer-left', 'Kreiran ' . date('d.m.Y H:i'))
        ->save($filename);
    }


}
