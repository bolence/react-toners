<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Login | React toneri</title>
    <link href="{{ asset('assets/vendor/bootstrap4/css/bootstrap.min.css') }}" rel="stylesheet">
    <link href="{{ asset('assets/css/auth.css') }}" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('assets/css/all.min.css') }}">
    <style>
        body {
            background-image: url("images/background.jpg");
            background-size: cover;
        }
    </style>

</head>
<body>
    <div class="wrapper">
        <div class="auth-content">
            <div class="card"  style="border-radius: 10px;">
                <div class="card-body text-center">
                    <div class="mb-4">
                        <img class="brand" src="{{ asset('/images/logo230px.png') }}" alt="bootstraper logo">
                    </div>
                    <div id="login">
                        <LoginComponent />
                    </div>
                </div>
            </div>
        </div>
    </div>

<script src="{{ asset('js/app.js') }}"></script>
</body>
</html>
