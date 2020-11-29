<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('accounts', [App\Http\Controllers\Api\ApiAccountController::class, 'index']);
Route::middleware('auth:api')->get('users', [App\Http\Controllers\Api\ApiUserController::class, 'index']);

Route::middleware('auth:api')->resource('orders', App\Http\Controllers\Api\ApiOrdersController::class);
Route::middleware('auth:api')->resource('printers', App\Http\Controllers\Api\ApiPrintersController::class);
Route::middleware('auth:api')->resource('bonuses', App\Http\Controllers\Api\ApiBonusController::class);
Route::middleware('auth:api')->get('statistics', [App\Http\Controllers\Api\ApiOrdersController::class, 'statistics']);
