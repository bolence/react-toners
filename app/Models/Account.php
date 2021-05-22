<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    use HasFactory;

    /**
     * The "booting" method of the model.
     *
     * @return void
     */
    protected static function boot()
    {
        parent::boot();
    }

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

    public function sum_orders_per_month($month = null)
    {
        $month = $month ? $month : date('Y');
        return $this->orders()
            ->where('month', '=', $month)
            ->sum(\DB::raw('price * quantity'));
    }

    public function count_orders_per_month($month = null)
    {
        $month = $month ? $month : date('Y');
        return $this->orders()
            ->where('month', '=', $month)
            ->count();
    }

    public function bonus()
    {
        return $this->hasMany(Bonus::class)->where('bonus_month', '=', date('m'));
    }

}
