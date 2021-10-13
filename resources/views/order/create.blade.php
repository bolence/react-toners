@extends('layouts.master')


@section('content')

@section('content')
<div class="container-fluid">
    <div class="page-title">
        <h3>Nova porudžbenica za službu <b>"{{ Auth::user()->account->sluzba }}"</b></h3>
    </div>

    <div class="row">
        <div class="col-12">
            <div id="order-create">
                <OrderCreate />
            </div>
        </div>

    </div>

</div>
@endsection


@endsection
