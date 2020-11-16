<?php

use Illuminate\Support\Facades\Route;

Auth::routes();

Route::get('/', function () {
    return view('auth.login');
});

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
Route::get('/limits', [App\Http\Controllers\HomeController::class, 'limits'])->name('limits');

Route::resource('orders', App\Http\Controllers\OrderController::class)->middleware('auth');
