<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;



Route::middleware('auth:api')->get('orders/copy_orders', [App\Http\Controller\Api\ApiOrdersController::class, 'copy_order_from_last_month']);

Route::get('accounts', [App\Http\Controllers\Api\ApiAccountController::class, 'index']);
Route::middleware('auth:api')->get('users', [App\Http\Controllers\Api\ApiUserController::class, 'index']);

Route::middleware('auth:api')->resource('orders', App\Http\Controllers\Api\ApiOrdersController::class);
Route::middleware('auth:api')->resource('printers', App\Http\Controllers\Api\ApiPrintersController::class);
Route::middleware('auth:api')->resource('bonuses', App\Http\Controllers\Api\ApiBonusController::class);
Route::middleware('auth:api')->get('statistics', [App\Http\Controllers\Api\ApiOrdersController::class, 'statistics']);
