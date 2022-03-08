<?php

namespace App\Http\Controllers\Api;

use Exception;
use App\Models\User;
use App\Models\Bonus;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ApiBonusController extends Controller
{

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

        try {
            Bonus::updateOrCreate(['account_id' => $request->account_id],
            [
                'bonus' => $request->bonus,
                'bonus_month' => date('m')
            ]);
        } catch (\Throwable $th) {
            info('Error occured ' . $th->getMessage() . ' ' . $th->getLine() . ' ' . $th->getCode());
            return response()->json([
                'message' => 'Došlo je do greške prilikom dodavanja bonusa'
            ],400);
        }

        return response()->json([
            'message' => 'Novi bonus dodat/izmenjen. Novi bonus je sad ' . number_format($request->bonus, 2),
            'users' => User::with('account.bonus')->get(),
        ], 200);

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {

        $bonus = Bonus::findOrFail($id);

        try
        {
            $bonus->delete();
        }
        catch (Exception $e)
        {
            info('Error occured ' . $e->getMessage() . ' ' . $e->getLine() . ' ' . $e->getCode());
            return response()->json([
                'message' => 'Došlo je do greške prilikom brisanja',
                'error_message' => $e->getMessage()
            ], 400);
        }

        return response()->json([
            'message' => 'Uspešno izbrisan bonus',
            'users' => User::with('account.bonus')->get(),
        ], 200);
    }
}
