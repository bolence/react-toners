import axios from "axios";
import React, { Component } from "react";
import ReactDOM from "react-dom";

class Logout extends Component {

    handleLogout = () => {
        let token = document.head.querySelector('meta[name="csrf-token"]');
        axios.post('/logout', token).then(response => {
            window.location.href = '/';
        });
    }
    render() {
        return (
            <li>
                <a
                    onClick={this.handleLogout}
                    href=""
                    className="dropdown-item"
                >
                    <i className="fas fa-sign-out-alt"></i> Logout
                </a>
            </li>
        );
    }
}

export default Logout;


if (document.getElementById("logout")) {
    ReactDOM.render(<Logout />, document.getElementById("logout"));
}
