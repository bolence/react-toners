<?php

namespace App\Console\Commands;

use App\Models\Order;
use App\Models\ReminderDate;
use App\Models\User;
use App\Notifications\InfoAboutAutomaticOrderFinished;
use Carbon\Carbon;
use Illuminate\Console\Command;

class ProcessAutomaticOrders extends Command
{
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

        $users_reminders = ReminderDate::with('user')
            ->whereDone(0)
            ->whereDate('reminder_date', '=', $today)
            ->where('automatic_copy', '=', 1)
            ->where('done', '=', 0)
            ->get();

        if (!$users_reminders) {
            return;
        }

        foreach ($users_reminders as $reminder) {
            $last_month_orders = Order::whereMonth('created_at', '=', date('m') - 1)
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


            $user = User::find($reminder->user_id);
            $user->notify(new InfoAboutAutomaticOrderFinished($last_month_orders));

            $this->info('Copied finished');
            $this->info('User reminders count: ' . $users_reminders->count());

            $reminder->done = 1;
            $reminder->save();
        }
    }
}
