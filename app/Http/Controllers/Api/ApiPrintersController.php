<?php

namespace App\Http\Controllers\Api;

use Exception;
use App\Models\Printer;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class ApiPrintersController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json(['printers' => Printer::orderBy('id', 'desc')->get()]);
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'price' => 'required',
            'catridge' => 'required'
        ],[
            'name.required' => 'Niste uneli ime štampača',
            'price.required' => 'Niste uneli cenu tonera',
            'catridge.required' => 'Niste uneli oznaku tonera'
        ]);

        if( ! Auth::user()->isAdmin())
        {
            return response()->json([
                'message' => 'Nemate prava za ovu radnju'
            ], 400);
        }

        try
        {
            $printer = Printer::create($request->all());
        }
        catch (Exception $e)
        {
            return response()->json([
                'message' => 'Došlo je do greške prilikom snimanja ' . $e->getMessage()
            ], 400);
        }

        return response()->json([
            'message' => 'Uspešno snimljen štampač',
            'printer' => $printer
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $printer = Printer::find($id);
        return response()->json($printer);
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
        $printer = Printer::find($id);

        if( ! $printer && ! Auth::user()->isAdmin() ){
            return response()->json([
                'message' => 'Ovaj štampač ne postoji ili nemate prava'
            ], 400);
        }

        try
        {
            $printer->price = $request->price;
            $printer->name  = $request->name;
            $printer->save();
        }
        catch (Exception $e)
        {
            return response()->json([
                'message' => 'Došlo je do greške ' . $e->getMessage()
            ], 400);
        }

        return response()->json([
            'message' => 'Uspešno izmenjen štampač ' . $printer->name,
            'printers' => Printer::orderBy('id', 'desc')->get()
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
        $printer = Printer::find($id);

        if( ! $printer || ! Auth::user()->isAdmin() )
        {
            return response()->json([
                'message' => 'Štampač nije pronađen ili nemate prava da izmenite'
            ], 400);
        }

        try
        {
            $printer->delete();
        }
        catch (\Exception $e)
        {
            return response()->json([
                'message' => 'Došlo je do greške prilikom brisanja ' . $e->getMessage()
            ], 400);
        }

        return response()->json([
            'message' => 'Uspešno izbrisan štampač'
        ], 200);
    }
}
