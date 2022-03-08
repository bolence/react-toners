<?php

namespace App\Console\Commands;

use App\Models\Order;
use App\Models\User;
use App\Notifications\ReminderForOrderNotification;
use Carbon\Carbon;
use Illuminate\Console\Command;

class ReminderForOrder extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'remind:user';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Remind user to enter orders to current month';

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
        $accounts = [];

        $orders = Order::with('account')
            ->whereMonth('created_at', '=', Carbon::today()->format('m'))
            ->groupBy('account_id')
            ->get();

        foreach ($orders as $order) {
            $accounts[] = $order->account->id;
        }

        if (count($accounts) > 0) {
            $users = User::whereNotIn('account_id', $accounts)
                ->groupBy('account_id')
                ->get();
        }

        if (isset($users) && count($users) > 0) {
            foreach ($users as $user) {
                $user->notify(new ReminderForOrderNotification($user));
            }
        }

        info('Podsetnik poslat na ' . count($users) . ' mejl adresa');
        $accounts = [];
    }
}
