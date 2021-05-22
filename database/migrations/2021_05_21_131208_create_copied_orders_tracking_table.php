<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCopiedOrdersTrackingTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('copied_orders_tracking', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('account_id')->index();
            $table->foreign('account_id')->references('id')->on('accounts');
            $table->smallInteger('order_month');
            $table->smallInteger('order_year');
            $table->decimal('order_sum');
            $table->smallInteger('order_count');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('copied_orders_tracking');
    }
}
