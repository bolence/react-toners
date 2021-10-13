import React, { Component } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import NumberFormat from "react-number-format";
import { Button, Modal } from "react-bootstrap";
import helpers from "./commons/Helpers";
import { ToastContainer } from "react-toastify";

class Users extends Component {
    state = {
        users: [],
        bonus: 0,
        account_id: "",
        showHide: false,
        account: {}
    };

    handleModalShowHide = account => {
        let bonus = account.bonus;
        let b = bonus && bonus[0] ? bonus[0].bonus : 0;
        this.setState({
            showHide: !this.state.showHide,
            bonus: b,
            account,
            account_id: account.id
        });
    };

    componentDidMount() {
        axios
            .get("/api/users")
            .then(response => {
                this.setState({ users: response.data });
            })
            .catch(error => {});
    }

    handleInputChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    saveBonus = () => {
        let data = {
            bonus: this.state.bonus,
            account_id: this.state.account_id
        };
        axios
            .post("/api/bonuses", data)
            .then(response => {
                this.setState({ users: response.data.users, showHide: false });
                helpers.notify(response.data.message);
            })
            .catch(error => {
                helpers.notify(error.response.data.message, true);
            });
    };

    deleteBonus = bonus => {
        axios
            .delete("/api/bonuses/" + bonus)
            .then(response => {
                helpers.notify(response.data.message);
                this.setState({ users: response.data.users });
            })
            .catch(error => {
                helpers.notify(error.data.message, true);
            });
    };

    render() {
        const { users, showHide, bonus, account } = this.state;

        return (
            <React.Fragment>
                <ToastContainer />
                <Modal show={showHide}>
                    <Modal.Header
                        closeButton
                        onClick={() => this.handleModalShowHide(account)}
                    >
                        <Modal.Title>Dodaj ili izmeni bonus</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <input
                            className="form-control"
                            name="bonus"
                            type="text"
                            value={bonus}
                            onChange={this.handleInputChange}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => this.handleModalShowHide(account)}
                        >
                            Zatvori
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => this.saveBonus()}
                        >
                            Snimi bonus
                        </Button>
                    </Modal.Footer>
                </Modal>

                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>Ime i prezime</th>
                            <th>Sektor</th>
                            <th>Služba</th>
                            <th>Limit</th>
                            <th>Bonus</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td scope="row">{user.name}</td>
                                <td>{user.account.sektor}</td>
                                <td>{user.account.sluzba}</td>
                                <td>
                                    <NumberFormat
                                        value={user.account.limit}
                                        thousandSeparator={true}
                                        displayType={"text"}
                                    />
                                </td>

                                <td>
                                    {JSON.stringify(user.account.bonus[0]) ? (
                                        <NumberFormat
                                            value={JSON.parse(
                                                user.account.bonus[0].bonus
                                            )}
                                            thousandSeparator={true}
                                            displayType={"text"}
                                        />
                                    ) : null}
                                </td>
                                <td>
                                    <a style={{ cursor: 'pointer' }}
                                        onClick={() =>
                                            this.handleModalShowHide(
                                                user.account
                                            )
                                        }
                                    >
                                        <i
                                            className="fa fa-plus"
                                            style={{ color: "blue" }}
                                        ></i>
                                    </a>
                                    &nbsp;
                                    <a style={{ cursor: 'pointer' }}
                                        className={
                                            JSON.stringify(
                                                user.account.bonus[0]
                                            ) ?? "d-none"
                                        }
                                        onClick={() =>
                                            confirm('Da li želiš da izbrišeš ovaj bonus?') && this.deleteBonus(
                                                JSON.stringify(
                                                    user.account.bonus[0]
                                                )
                                                    ? JSON.parse(
                                                          user.account.bonus[0]
                                                              .id
                                                      )
                                                    : null
                                            )
                                        }
                                    >
                                        <i
                                            className="fa fa-minus"
                                            style={{ color: "red" }}
                                        ></i>
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </React.Fragment>
        );
    }
}

export default Users;

if (document.getElementById("users")) {
    ReactDOM.render(<Users />, document.getElementById("users"));
}
