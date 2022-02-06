import React, { Component } from "react";
import ReactDOM from "react-dom";
import axios from "axios";

export default class Login extends Component {

    state = {
        email: "",
        password: "",
        errors: {
            email: '',
            message: '',
        },
        token_mismatch_error: false,
        token_mismatch_message: '',
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
                let user = JSON.stringify(response.data.user);
                let token = response.data.token;
                localStorage.setItem('toneri.token', token);
                localStorage.setItem('toneri.user', user);
                localStorage.setItem('toneri.latest_session_time', new Date());
                window.location.href = '/home'

            })
            .catch(error => {
                let errors = error.response.data;

                if(errors.message == 'token_mismatch'){
                    this.setState({
                        token_mismatch_error: true,
                        token_mismatch_message: errors.message,
                    });
                }else {
                    this.setState({ errors: errors.errors });
                }

            });
    };

    render() {
        const {
            email,
            password,
            errors,
            token_mismatch_error,
            token_mismatch_message
        } = this.state;

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
                    <div className={token_mismatch_error ? 'alert alert-default alert-dismissible fade show' : 'd-none' } role="alert" >
                        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            <span className="sr-only">Close</span>
                        </button>
                        <strong>{token_mismatch_message}</strong>
                    </div>
                </form>
                <p className="mb-2 text-muted float-left mt-4">
                    Zaboravljena šifra? <a href="/password/reset"><b>Reset</b></a>
                </p>
                <p className="mb-0 text-muted float-left ">
                    Nemaš nalog? <a href="/register"><b>Registruj se</b></a>
                </p>
                <p className="float-right font-weight-bold" style={{ position: "absolute", bottom: 0, right: 0, left: 0, marginBottom: -50, fontSize: 30 }}>
                    Developed by: Boško Bošković
                </p>
            </React.Fragment>
        );
    }
}

if (document.getElementById("login")) {
    ReactDOM.render(<Login />, document.getElementById("login"));
}
