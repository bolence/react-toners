<?php

namespace App\Console\Commands;

use App\Models\CopiedOrder;
use App\Models\Order;
use App\Models\ReminderDate;
use App\Models\User;
use App\Notifications\InfoAboutAutomaticOrderFinished;
use App\Traits\Financial;
use Carbon\Carbon;
use Illuminate\Console\Command;

class ProcessAutomaticOrders extends Command
{

    use Financial;
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'automatic:orders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process automatic orders by users';

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

        $today = Carbon::today()->format('Y-m-d');
        $previuos_month = Carbon::now()->subMonth();

        $users_reminders = ReminderDate::with('user')
            ->whereDone(0)
            ->whereDate('reminder_date', '=', $today)
            ->where('automatic_copy', '=', 1)
            ->get();

        if ( ! $users_reminders ) return;

        foreach ($users_reminders as $reminder)
        {
            $last_month_orders = Order::whereMonth('created_at', '=', $previuos_month )
                ->where('account_id', '=', $reminder->user->account_id)
                ->get();

            $this->info('Last month orders: ' . count($last_month_orders));

            if(count($last_month_orders) == 0) return;

            foreach ($last_month_orders as $last_order) {
                $order = new Order;
                $order->quantity = $last_order->quantity;
                $order->price = $last_order->price;
                $order->account_id = $last_order->account_id;
                $order->month = date('m');
                $order->printer_id = $last_order->printer_id;
                $order->user_id = $last_order->user_id;
                $order->copied = 1;
                $order->save();
            }


            $user = User::findOrFail($reminder->user_id);
            if($user) {
                $user->notify(new InfoAboutAutomaticOrderFinished($last_month_orders));
            }

            $this->info('Copied finished');
            $this->info('User reminders count: ' . $users_reminders->count());

            CopiedOrder::create([
                'account_id' => $reminder->user->account_id,
                'order_month' => $previuos_month,
                'order_year'  => Carbon::now()->year(),
                'order_sum'   => $this->get_orders_sum(),
                'order_count' => $this->count_orders_per_month()
            ]);

            $reminder->done = 1;
            $reminder->save();
        }
    }
}
