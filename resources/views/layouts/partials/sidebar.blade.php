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
        <li>
            <a href="/limits" class="{{ (request()->is('limits')) ? 'active' : '' }}"><i class="fas fa-table"></i> Limiti</a>
        </li>
    </ul>
</nav>
