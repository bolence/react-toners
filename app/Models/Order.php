<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    /**
     * The attributes that aren't mass assignable.
     *
     * @var array
     */
    protected $guarded = ['id'];

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['created_at', 'updated_at', 'deleted_at'];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function printer()
    {
        return $this->belongsTo(Printer::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function orders_sum($month = null)
    {
        $month = (int) $month == null ? date('m') : $month;
        return $this->where('account_id', '=', $this->account_id)
                     ->where('month', '=', $month)
                     ->whereYear('created_at', date('Y'))
                     ->sum(\DB::raw('price * quantity'));
    }


}
