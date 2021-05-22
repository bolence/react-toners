<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ $title . ' - Toneri' ?? ' Toneri' }} </title>
    <link href="{{ asset('assets/vendor/bootstrap4/css/bootstrap.min.css') }}" rel="stylesheet">
    <link href="{{ asset('assets/css/master.css') }}" rel="stylesheet">
    <link rel="icon" type="image/ico" href="{{ asset('images/favicon.ico') }}">
    @stack('css')
</head>

<body>
    <div class="wrapper">
        @include('layouts.partials.sidebar')
        <div id="body" class="active">
            @include('layouts.partials.header')
            <div class="content">

                @yield('content')
            </div>
        </div>
    </div>

    <script src="{{ asset('assets/vendor/jquery3/jquery.min.js') }}"></script>
    <script src="{{ asset('assets/vendor/bootstrap4/js/bootstrap.bundle.min.js') }}"></script>
    <script src="{{ asset('assets/vendor/fontawesome5/js/solid.min.js') }}"></script>
    <script src="{{ asset('assets/vendor/fontawesome5/js/fontawesome.min.js') }}"></script>
    <script src="{{ asset('assets/vendor/fontawesome5/js/fontawesome.min.js') }}"></script>
    <script src="{{ asset('assets/js/script.js') }}"></script>
    <script src="{{ asset('assets/vendor/bootstrap4/js/bootstrap.bundle.min.js') }}"></script>
    <script src="{{ asset('/js/app.js') }}"></script>
    <script src="{{ asset('js/bootstrap-session-timeout.min.js') }}"></script>
    @stack('js')
    <script>
        $(document).ready(function() {
            var sessionLogout = function() {
                $.sessionTimeout({
                    keepAliveUrl: '/keep_alive',
                    ajaxType: 'GET',
                    logoutUrl: '/logout',
                    redirUrl: '/logout',
                    warnAfter: 900000,
                    // warnAfter: 5000, // for test
                    redirAfter: 960000,
                    keepAliveInterval: 60000,
                    countdownBar: true,
                    countdownMessage: 'Redirektovanje za {timer} sekundi.',
                    title: 'Isticanje sesije logovanog korisnika!',
                    message: 'Tvoja sesija će uskoro da istekne.',
                    logoutButton: 'Izloguj se',
                    keepAliveButton: 'Ostani ulogovan',
                    onStart: function(opts) {},
                });
            }

            sessionLogout();
        });

    </script>
</body>

</html>
