<?php namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class ReminderDate extends Model {

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
    protected $dates = ['created_at', 'updated_at', 'deleted_at', 'reminder_date'];


    public function user()
    {
        return $this->belongsTo(User::class);
    }


}
