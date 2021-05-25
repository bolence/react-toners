<?php

namespace App\Console\Commands;

use App\Models\Order;
use Illuminate\Support\Str;
use App\Services\PDFCreator;
use App\Notifications\PdfOrder;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class SendOrderPdfForCurrentMonth extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'send:order';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send order in PDF format for current month';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {

        $orders = Order::with('user.account')
        ->whereMonth('created_at', '=', date('m'))
        ->groupBy('account_id')
        ->get();

        if (!$orders) {
            return;
        }

        foreach ($orders as $order) {
            PDFCreator::create_pdf($order->user);
            $order->user->notify(new PdfOrder($order->user));
            Log::info('PDF orders sent to ' . $order->user->name);
        }

    }
}
