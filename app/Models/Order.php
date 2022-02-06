<?php

namespace App\Models;

use App\Scopes\YearScope;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
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
        static::addGlobalScope(new YearScope);

    }

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'copied' => 'boolean',
    ];

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
            ->sum(DB::raw('price * quantity'));
    }

    public static function get_count_of_orders()
    {
        return self::whereRaw('MONTH(created_at) = ' . date('m'))
            ->count() > 0;
    }

    public static function current_month_order($account_id)
    {
        return self::with('printer', 'account')
            ->whereMonth('created_at', '=', date('m'))
            ->where('account_id', '=', $account_id)
            ->get();
    }


    public static function previous_month_order($account_id)
    {
        return self::with('printer', 'account')
            ->whereMonth('created_at', '=', date('m') - 1)
            ->where('account_id', '=', $account_id)
            ->count() > 0;
    }

}
