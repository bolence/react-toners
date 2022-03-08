<?php

namespace App\Console;

use App\Console\Commands\ReminderForOrder;
use Illuminate\Console\Scheduling\Schedule;
use App\Console\Commands\ProcessAutomaticOrders;
use App\Console\Commands\SendOrderPdfForCurrentMonth;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use App\Console\Commands\SendAllOrdersForCurrentMonthToAdmin;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        ProcessAutomaticOrders::class,
        SendOrderPdfForCurrentMonth::class,
        ReminderForOrder::class,
        SendAllOrdersForCurrentMonthToAdmin::class,

    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->command('automatic:orders')->dailyAt('08:00');
        $schedule->command('send:order')->monthlyOn(28, '09:00'); // send pdf with current month order of toners for each user
        $schedule->command('remind:user')->monthlyOn(25, '10:00'); // remind user if he hasn't order anything
        $schedule->command('send:all-orders')->monthlyOn('28', '07:00'); //send all orders to admin
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
