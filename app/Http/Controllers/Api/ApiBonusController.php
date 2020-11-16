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
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

        $matchThese = [
            'account_id' => $request->account_id,
            'bonus_month' => date('m')
        ];

        $bonus = Bonus::updateOrCreate($matchThese, [
            'bonus' => $request->bonus,
            'account_id' => $request->account_id,
            'bonus_month' => date('m')
        ]);

        if( $bonus )
        {
            return response()->json([
                'message' => 'Novi bonus dodat/izmenjen. Novi bonus je sad ' . number_format($request->bonus, 2),
                'users' => User::with('account.bonus')->get(),
            ], 200);
        }

        return response()->json([
            'message' => 'Novi bonus nije moguće dodati'
        ],400);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {

        $bonus = Bonus::find($id);

        if(! $bonus )
        {
            return response()->json([
                'message' => 'Ovaj bonus ne postoji ili je već izbrisan'
            ], 400);
        }

        try
        {
            $bonus->delete();
        }
        catch (Exception $e)
        {
            return response()->json([
                'message' => 'Došlo je do greške priliko brisanja',
                'error_message' => $e->getMessage()
            ], 400);
        }

        return response()->json([
            'message' => 'Uspešno izbrisan bonus',
            'users' => User::with('account.bonus')->get(),
        ], 200);
    }
}
