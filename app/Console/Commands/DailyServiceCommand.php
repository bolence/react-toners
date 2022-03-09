<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class DailyServiceCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'daily:maintainance';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Daily service commands for maintantance';

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
        $commands = [
            'php artisan cache:clear',
            'php artisan config:cache',
            'php artisan view:clear',
            'php artisan optimize',
            'php artisan optimize:clear',
            'composer du'
        ];

        foreach($commands as $command)
        {
            exec($command);
        }
    }
}
