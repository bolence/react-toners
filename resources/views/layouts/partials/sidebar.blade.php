<nav id="sidebar">
    <div class="sidebar-header">
        <img src="{{ asset('/images/logo230px.png') }}" alt="bootraper logo" class="app-logo mb-3">
    </div>
    <ul class="list-unstyled components text-secondary">
        <li>
            <a href="/home" class="{{ (request()->is('home')) ? 'active' : '' }}"><i class="fas fa-home"></i> Početna</a>
        </li>
        <li>
            <a href="/orders/create" class="{{ (request()->is('orders/create')) ? 'active' : '' }}"><i class="fas fa-file-alt"></i> Dodaj porudžbenicu</a>
        </li>

        {{-- <li>
            <a href="statistics" class="{{ (request()->is('statistics')) ? 'active' : '' }}"><i class="fa fa-chart-bar"></i> Statistika</a>
        </li> --}}
        @if(Auth::check() && Auth::user()->isAdmin())
        <li>
            <a href="/limits" class="{{ (request()->is('limits')) ? 'active' : '' }}"><i class="fas fa-table"></i>Sektorski limiti</a>
        </li>
        <li>
            <a href="/printers" class="{{ (request()->is('printers')) ? 'active' : '' }}"><i class="fas fa-print"></i>Administracija štampača</a>
        </li>
        @endif
    </ul>
</nav>
