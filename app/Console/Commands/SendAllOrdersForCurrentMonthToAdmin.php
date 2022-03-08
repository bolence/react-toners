<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use App\Models\User;
use App\Models\Order;
use App\Services\PDFCreator;
use Illuminate\Console\Command;
use App\Notifications\AllOrdersForCurrentMonthNotification;

class SendAllOrdersForCurrentMonthToAdmin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'send:all-orders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send all finished orders to admin';

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
        $orders = Order::whereMonth('created_at', '=', Carbon::now()->format('m'))->get();

        if(count($orders) == 0 ) return;

        PDFCreator::create_pdf_for_summary_orders($orders);

        $user = User::where('email', '=', 'goran.milosavljevic@beogradput.com')->first();

        $user->notify( new AllOrdersForCurrentMonthNotification());

        $this->info('All orders PDF created');
    }
}
