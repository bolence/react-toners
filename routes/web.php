<?php

use Illuminate\Support\Facades\Route;

Auth::routes();

Route::get('/', function () {
    return view('auth.login');
});

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
// Route::get('/statistics', [App\Http\Controllers\HomeController::class, 'statistics'])->name('statistics');
Route::get('/limits', [App\Http\Controllers\HomeController::class, 'limits'])->name('limits');
Route::get('/printers', [App\Http\Controllers\PrinterController::class, 'index'])->name('printers');

Route::resource('orders', App\Http\Controllers\OrderController::class)->middleware('auth');
Route::get('reports', [App\Http\Controllers\PdfController::class, 'index'])->middleware('auth');
