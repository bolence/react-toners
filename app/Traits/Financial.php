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
        $has_bonus = count(Auth::user()->account->bonus) > 0;
        return $has_bonus ? (int) Auth::user()->account->bonus[0]->bonus : 0;
    }

    public function get_orders_count()
    {
        return Auth::user()->account->count_orders_per_month();
    }

    public function get_orders_sum()
    {
        return (int) Auth::user()->account->sum_orders_per_month();
    }

    public function get_summary()
    {
        // var_dump($this->get_limit());
        // var_dump($this->get_bonus());
        // var_dump($this->get_orders_sum());
        return (int) ($this->get_limit() + $this->get_bonus()) - $this->get_orders_sum();
    }


  }
