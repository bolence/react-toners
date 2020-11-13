import React, { Component } from "react";
import ReactDOM from "react-dom";

export default class Register extends Component {
    state = {
        email: "",
        password: "",
        name: "",
        password_confirm: "",
        errors: {}
    };

    handleInputChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleRegister = (e) => {
        e.preventDefault();

        const data = {
            email: this.state.email,
            password: this.state.password,
            name: this.state.name,
            password_confirm: this.state.password_confirm
        };

        axios
            .post("/register", data)
            .then(response => {
                let data = response.response.data;
                window.location.href = data.redirect;
            })
            .catch(error => {
                this.setState({ errors: error.response.data.errors });
            });
    };
    render() {

        const { email, password, name, password_confirm, errors } = this.state;
        const isDisabled = email.length > 1 && password.length > 1 && name.length > 1 && password_confirm.length > 1

        return (
            <React.Fragment>
                <h5 className="mb-4 text-muted">Registrujte novi nalog</h5>
                <form>
                    <div className="form-group">
                        <input
                            autoFocus
                            type="email"
                            name="email"
                            className={
                                errors && errors.email
                                    ? "form-control is-invalid"
                                    : "form-control"
                            }
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
                            type="text"
                            name="name"
                            className={
                                errors && errors.name
                                    ? "form-control is-invalid"
                                    : "form-control"
                            }
                            placeholder="Ime i prezime"
                            value={name}
                            onChange={this.handleInputChange}
                            required
                        />

                        <span
                            className={
                                errors && errors.name
                                    ? "text-danger float-left mb-2"
                                    : ""
                            }
                        >
                            {errors.name}
                        </span>
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            className={
                                errors && errors.password
                                    ? "form-control is-invalid"
                                    : "form-control"
                            }
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

                    <div className="form-group">
                        <input
                            type="password"
                            name="password_confirm"
                            className="form-control"
                            placeholder="Ponovi šifru"
                            value={password_confirm}
                            onChange={this.handleInputChange}

                        />
                    </div>

                    <button
                        className="btn btn-primary shadow-2 mb-4 float-right mt-3"
                        onClick={this.handleRegister}
                        disabled={!isDisabled}
                    >
                        <i className="fa fa-lock" aria-hidden="true"></i> Registruj se
                    </button>
                </form>
                <p className="mb-0 text-muted float-left mt-4">
                    Imaš nalog?
                    <a href="/login">
                        <b> Uloguj se</b>
                    </a>
                </p>
            </React.Fragment>
        );
    }
}

if (document.getElementById("register")) {
    ReactDOM.render(<Register />, document.getElementById("register"));
}
