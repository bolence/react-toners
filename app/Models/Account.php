<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    use HasFactory;

    /**
     * Undocumented function
     *
     * @return void
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function sum_orders_per_month()
    {
        return $this->orders()
                ->where('month', '=', date('m'))
                ->whereYear('created_at', '=', date('Y'))
                ->sum(\DB::raw('price * quantity'));
    }

    public function bonus()
    {
        return $this->hasMany(Bonus::class)->where('bonus_month', '=', date('m'));
    }

}
