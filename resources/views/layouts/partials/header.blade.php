<nav class="navbar navbar-expand-lg navbar-white bg-white">
    <button type="button" id="sidebarCollapse" class="btn btn-outline-secondary default-secondary-menu"><i
            class="fas fa-bars"></i><span></span></button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="nav navbar-nav ml-auto">
            <li class="nav-item dropdown">
                <div class="nav-dropdown">
                    <a href="" class="nav-item nav-link dropdown-toggle text-secondary" data-toggle="dropdown"><i
                            class="fas fa-user"></i> <span>
                            @if (Auth::check()){{ Auth::user()->name }}@endif
                        </span> <i style="font-size: .8em;" class="fas fa-caret-down"></i></a>
                    <div class="dropdown-menu dropdown-menu-right nav-link-menu">
                        <ul class="nav-list">

                            <div class="dropdown-divider"></div>
                            @if(\App\Models\Order::get_count_of_orders())
                            <li>
                                <a href="/reports" class="dropdown-item">
                                    <i class="fa fa-print"></i> Izveštaj za sve službe
                                </a>
                            </li>
                            @endif
                            <li>
                                <a href="/logout" class="dropdown-item">
                                    <i class="fa fa-sign-out-alt"></i> Logout
                                </a>
                            </li>
                            @if (Auth::check() && Auth::user()->isAdmin() && \App\Models\Order::get_count_of_orders())
                                <div class="dropdown-divider"></div>

                            @endif

                        </ul>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</nav>
