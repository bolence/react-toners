@extends('layouts.master')


@section('content')

<div class="container-fluid">
    <div class="page-title">
        <h3>Statistika potrošnje</h3>
    </div>

    <div class="row">
        <div class="col-12">
            <div id="statistics">
                <Statistics />
            </div>
        </div>

    </div>

</div>

@endsection
