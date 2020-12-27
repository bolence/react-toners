<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
<style>

tr {
    page-break-inside: avoid;
}

@media print {
  footer {page-break-after: always;}
}

</style>
</head>
<body>



<div class="row">

<div class="col-md-10">

  <div class="col-md-6">
    <img src="{{ asset('images/logo230px.png') }}" />
  </div>

</div>

<div class="col-md-10">
    <?php $sum = 0; ?>
    <h3 style="text-align: center; margin: 0 auto; padding: 30px; font-weight: bolder; font-style: 'Helvetica';">
        Spisak poručenih tonera {{ date('m') }}.mesec {{ date('Y') }}.godina
    </h3>
  <table class="table table-bordered table-striped" border="1" cellpadding="2" cellspacing="2">
      <thead>
        <tr bgcolor="#fdb817">
          <th scope="col">Poručio</th>
          <th scope="col">Služba</th>
          <th scope="col">Štampač</th>
          <th scope="col">Toner</th>
          <th scope="col">Količina</th>
          <th scope="col">Jed.cena</th>
          <th scope="col">Kreirano</th>
          <th scope="col">Ukupno</th>
        </tr>
      </thead>
      <tbody>

        @foreach( $orders as $order)
        <?php $sum += $order->printer->price * $order->quantity; ?>
        <tr>
          <td style="font-size: 15px; font-weight: bold;">{{ $order->user->name }}</td>
          <td style="font-size: 15px; font-weight: bold;">{{ $order->user->account->sluzba }}</td>
          <td style="font-size: 15px; font-weight: bold;">{{ $order->printer->name }}</td>
          <td style="font-size: 15px; font-weight: bold;">{{ $order->printer->catridge }}</td>
          <td style="font-size: 15px; font-weight: bold;">{{ $order->quantity }}</td>
          <td style="font-size: 15px; font-weight: bold;">{{ number_format($order->printer->price,2) }}</td>
          <td style="font-size: 15px; font-weight: bold;">{{ \Carbon\Carbon::parse($order->created_at)->format('d/m/Y') }}</td>
          <td style="font-size: 15px; font-weight: bold;">{{ number_format($order->printer->price * $order->quantity,2) }}</td>
        </tr>

        @endforeach

        <tr>
            <td colspan="6"></td>
            <td style="font-size: 15px; font-weight: bold;pApi">Okvirno za plaćanje:</td>
            <td style="font-size: 15px; font-weight: bold;">{{ number_format($sum,2) }} RSD.</td>
          </tr>
      </tbody>
  </table>


</div>

</div>




</body>
</html>
