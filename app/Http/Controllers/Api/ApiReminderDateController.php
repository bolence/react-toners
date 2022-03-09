<?php namespace App\Http\Controllers\Api;

use Exception;
use App\Models\User;
use App\Models\ReminderDate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Notifications\AutomaticOrderCopyNotification;

class ApiReminderDateController extends Controller {

    /**
     * Save reminder
     *
     * @param Request $request
     * @return Illuminate\Response
     */
    public function store(Request $request)
    {

        $user = (object) $request->user;

        if(
            ReminderDate::where('account_id', '=', $user->account_id)
                        ->where('user_id', '=', $user->id)
                        ->whereMonth('created_at', '=', date('m'))
                        ->exists()
        )
        {
            return response()->json([
                'message' => 'Već ste dodali podsetnik za ovaj mesec'
            ], 400);
        }

        $reminder = new ReminderDate;
        $reminder->account_id = $user->account_id;
        $reminder->user_id = $user->id;
        $reminder->reminder_date = $request->reminder_date;
        $reminder->automatic_copy = 1;

        try
        {
            $reminder->save();
        }
        catch ( Exception $e)
        {
            Log::error(' Error occured on line ' . $e->getLine() . ' in file ' . $e->getFile() . ' with message ' . $e->getMessage());
            return response()->json([
                'message' => 'Došlo je do greške prilikom snimanja podsetnika.',
                'error_console_message' => $e->getMessage()
            ], 400);
        }

        info('Reminder saved by ' . $user->name);

        $user = User::findOrFail($user->id);

        $user->notify( new AutomaticOrderCopyNotification($reminder) );

        return response()->json([
            'message' => 'Uspešno snimljen podsetnik za porudžbenicu.Dobićete obaveštenje na email ' . $user->email,
            'reminder_date_message' => 'Vaš podsetnik je podešen za ' . $reminder->reminder_date->format('d.m.Y') . '. Dobićete email kao podsetnik.',
        ], 200);
    }

}
