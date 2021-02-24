import axios from "axios";
import React, { Component } from "react";
import ReactDOM from "react-dom";

export default class Logout extends Component {


      handleLogout = () => {
        let token = document.head.querySelector('meta[name="csrf-token"]');
        axios.post('/logout', token).then(() => {
            window.location.href = '/';
            localStorage.clear();
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

if (document.getElementById("logout")) {
    ReactDOM.render(<Logout />, document.getElementById("logout"));
}
