<?php namespace App\Http\Controllers\Api;

use Exception;
use App\Models\ReminderDate;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class ApiReminderDateController extends Controller {


    public function store()
    {
        $user = Auth::user();

        if(
            ReminderDate::where('account_id', '=', $user->account_id)
                        ->where('user_id', '=', Auth::id())
                        ->whereMonth('created_at', '=', date('m'))
                        ->whereYear('created_at', '=', date('Y'))
                        ->exists()
        )
        {
            return response()->json([
                'message' => 'Već ste dodali podsetnik za ovaj mesec'
            ], 400);
        }

        $reminder = new ReminderDate;
        $reminder->account_id = Auth::user()->account_id;
        $reminder->user_id = Auth::id();
        $reminder->reminder_date = request()->reminder_date->format('Y-m-d');

        try
        {
            $reminder->save();
        }
        catch ( Exception $e)
        {
            Log::error(' Error occured on line ' . $e->getLine() . ' in file ' . $e->getFile() . ' with message ' . $e->getMessage());
            return response()->json([
                'message' => 'Došlo je do greške prilikom snimanja podsetnika',
                'error_console_message' => $e->getMessage()
            ], 400);
        }

        Log::info(' Reminder saved by' . Auth::user()->name);

        return response()->json([
            'message' => 'Uspešno snimljen podsetnik za porudžbenicu.Dobićete obaveštenje na email ' . Auth::user()->email,
            'reminder_date_message' => 'Vaš podsetnik je podešen za ' . $reminder->created_at->format('d.m.Y') . '. Dobićete email kao podsetnik.',
        ], 200);
    }

}
