<?php

namespace App\Http\Controllers\Api;

use Auth;
use Exception;
use App\Models\Order;
use App\Models\Account;
use App\Models\Printer;
use App\Traits\Financial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Requests\CreateNewOrder;

class ApiOrdersController extends Controller
{

    use Financial;

    public function index(Request $request)
    {

        $year = date('Y');
        $user = Auth::user();
        $month = $request->month ? $request->month : date('m');

        $orders = Order::with('account', 'printer')
        ->when($month !== 'all', function($q) use($user, $month){
            $q->where('account_id', '=', $user->account_id)->whereRaw('MONTH(created_at) = ' . $month);
        })->whereYear('created_at', '=', $year)
        ->when($month == 'all', function($q) {
            $q->where('month', '=', date('m'));
        })
        ->orderBy('id', 'desc')
        ->get();


        return response()->json([
            'orders' => $orders,
            'orders_count' => $orders->count(),
            'title' => "Poručeni toneri " . $user->account->sluzba . " u $year.godini",
            'summary' => $this->get_summary_info()
        ], 200);
    }

    public function store(CreateNewOrder $request)
    {
        $user = Auth::user();

        $printer = Printer::find($request->printer);
        $order_sum = $request->quantity * $printer->price;

        if( $this->get_summary() < $order_sum)
        {
            return response()->json([
                'message' => 'Premašili ste limit za ovaj mesec',
                'errors' => [],
            ], 400);
        }

        $this->check_if_exist($user->account_id, $request->printer);

        Order::create([
            'quantity'   => $request->quantity,
            'printer_id' => $request->printer,
            'price'      => $printer->price,
            'month'      => date('m'),
            'account_id' => $user->account_id,
            'user_id' => $user->id,
            'napomena'   => isset($request->napomena) ? $request->napomena : null
        ]);

        return response()->json([
            'message' => 'Uspešno snimljena porudžbenica',
            'order' => Order::with('printer')->latest()->first(),
            'summary' => $this->get_summary_info(),
            'errors' => []
        ], 200);
    }

    /**
     * Undocumented function
     *
     * @param Account $account
     * @param double $order_price
     * @return void
     */
    protected function check_limit(Account $account, $order_price)
    {

        $limit = $account->limit;
        $sum_of_ordered = (new Order)->orders_sum(Auth::user()->account->id);

        if( ($limit - $sum_of_ordered) > $order_price )
        {
            return false;
        }

        return true;
    }

    protected function check_if_exist($account_id, $printer_id)
    {

        $order = Order::where('account_id', '=', $account_id)
        ->where('printer_id', '=', $printer_id)
        ->where('month', '=', date('m'))
        ->whereYear('created_at', '=', date('Y'))
        ->first();

        if($order)
        {
            return response()->json([
                'message' => 'Ovaj toner ste već dodali ovog meseca. Dodajte drugi.'
            ], 400);
        }
    }

    /**
     * Undocumented function
     *
     * @param integer $id
     * @return void
     */
    public function destroy($id)
    {

        $order = Order::find($id);

        if( ! $order && !Auth::user()->isAdmin() )
        {
            return response()->json([
                'message' => 'Ova porudžbenica ne postoji u bazi podataka!'
            ], 400);
        }

        try
        {
            $order->delete();
        }
        catch (Exception $e)
        {

            Log::error($e->getMessage());

            return response()->json([
                'message' => 'Nismo uspeli da izbrišemo ovu porudžbenicu',
                'error_message' => $e->getMessage(),
            ],400);
        }

        Log::info('Order has been deleted');

        return response()->json([
            'message' => 'Uspešno ste izbrisali porudžbenicu',
            'summary' => $this->get_summary_info(),
        ], 200);
    }

    private function get_summary_info()
    {
        return [
            'bonus' => $this->get_bonus(),
            'orders_sum' => $this->get_orders_sum(),
            'limit' => $this->get_limit(),
            'orders_count' => $this->get_orders_count(),
            'summary' => $this->get_summary()
        ];
    }

    public function statistics()
    {

        $statistics = DB::select("
            SELECT o.id, a.sektor, a.sluzba, sum(quantity * price) as orders_sum, count(a.id) as orders_count, o.`month`, year(o.created_at) as year
            FROM orders o
            JOIN accounts a
            ON a.id = o.account_id
            GROUP BY o.`month`, year(o.created_at), a.id
            ORDER BY year(o.created_at) desc, o.month desc"
        );

        return response()->json($statistics);

    }
}
