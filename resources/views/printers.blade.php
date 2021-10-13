@extends('layouts.master')


@section('content')

<div class="container-fluid">
    <div class="page-title">
        <h3>Spisak štampača</h3>
    </div>

    <div class="row">
        <div class="col-12">
            <div id="printers">
                <Printers />
            </div>
        </div>

    </div>

</div>

@endsection
