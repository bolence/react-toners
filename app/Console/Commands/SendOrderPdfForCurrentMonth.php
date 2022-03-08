<?php

namespace App\Console\Commands;

use App\Models\Order;
use App\Services\PDFCreator;
use App\Notifications\PdfOrder;
use Illuminate\Console\Command;

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

        if (count($orders) == 0){
            $this->error('There is no any orders');
            return;
        }

        $count = 0;

        foreach ($orders as $order) {
            PDFCreator::create_pdf_for_user($order->user);
            $order->user->notify(new PdfOrder($order->user));
            info('PDF orders sent to ' . $order->user->name);
            $count++;
        }

        $this->info($count . ' služba/i je poručilo tonere.');

    }
}
