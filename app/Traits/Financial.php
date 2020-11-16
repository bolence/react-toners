<?php

use Illuminate\Support\Facades\Auth;

  namespace App\Traits;
  use Auth;

  trait Financial
  {

    public function get_limit()
    {
        return (int) Auth::user()->account->limit;
    }

    public function get_bonus()
    {
        return Auth::user()->account->bonus ? (int) Auth::user()->account->bonus[0]->bonus : 0;
    }

    public function get_orders_sum()
    {
        return Auth::user()->account->sum_orders_per_month();
    }

    public function get_summary()
    {
        return (int) ($this->get_limit() + $this->get_bonus()) - $this->get_orders_sum();
    }


  }
