<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'account_id',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'admin' => 'boolean'
    ];

    /**
     * Undocumented function
     *
     * @param [type] $notification
     * @return void
     */
    public function routeNotificationForMail($notification)
    {
        return $this->email;
    }

    /**
     * Undocumented function
     *
     * @return void
     */
    public function account()
    {
        return $this->hasOne(Account::class, 'id', 'account_id');
    }

    public function reminder()
    {
        return $this->hasMany(ReminderDate::class);
    }

    public function order()
    {
        return $this->hasMany(Order::class, 'user_id');
    }

    public function isAdmin()
    {
        return $this->admin;
    }
}
