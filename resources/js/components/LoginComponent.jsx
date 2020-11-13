import React, { Component } from "react";
import ReactDOM from "react-dom";
import axios from "axios";

export default class Login extends Component {

    state = {
        email: "",
        password: "",
        errors: {}
    };

    handleInputChange = (e) => {
        this.setState({[e.target.name] : e.target.value});

    }

    handleLogin = (e) => {
        e.preventDefault();

        const data = {
            email: this.state.email,
            password: this.state.password
        };

        axios
            .post("/login", data)
            .then(response => {
                let data = response.response.data;
                if(data.success){
                    window.location.href = data.redirect;
                }
            })
            .catch(error => {
                this.setState({ errors: error.response.data.errors });
            });
    };

    render() {
        const { email, password, errors} = this.state;
        const isEnabled = email.length > 1 && password.length > 1;

        return (
            <React.Fragment>
                <h5 className="mb-4 text-muted">Ulogujte se sa svojim nalogom</h5>
                <form>
                    <div className="form-group">
                        <input
                            autoFocus
                            type="email"
                            name="email"
                            className={errors && errors.email ? 'form-control is-invalid' : 'form-control'}
                            placeholder="Email"
                            value={email}
                            onChange={this.handleInputChange}
                            required
                        />

                        <span
                            className={
                                errors && errors.email
                                    ? "text-danger float-left mb-2"
                                    : ""
                            }
                        >
                            {errors.email}
                        </span>
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            className={errors && errors.password ? 'form-control is-invalid' : 'form-control'}
                            placeholder="Šifra"
                            value={password}
                            onChange={this.handleInputChange}
                            required
                        />

                        <span
                            className={
                                errors && errors.password
                                    ? "text-danger float-left mt-1"
                                    : ""
                            }
                        >
                            {errors.password}
                        </span>
                    </div>

                    <button
                        className="btn btn-primary shadow-2 mb-4 float-right mt-3"
                        onClick={this.handleLogin}
                        disabled={!isEnabled}
                    >
                    <i className="fa fa-lock" aria-hidden="true"></i> Login
                    </button>
                </form>
                <p className="mb-2 text-muted float-left mt-4">
                    Zaboravljena šifra? <a href="/forgot/password"><b>Reset</b></a>
                </p>
                <p className="mb-0 text-muted float-left ">
                    Nemaš nalog? <a href="/register"><b>Registruj se</b></a>
                </p>
            </React.Fragment>
        );
    }
}

if (document.getElementById("login")) {
    ReactDOM.render(<Login />, document.getElementById("login"));
}
