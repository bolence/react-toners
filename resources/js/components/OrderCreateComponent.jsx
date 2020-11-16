import axios from "axios";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import Select from "react-select";
import { ToastContainer } from "react-toastify";
import helpers from "./commons/Helpers";
import Moment from "react-moment";
import NumberFormat from "react-number-format";

export default class OrderCreate extends Component {
    state = {
        printers: [],
        printer: null,
        catrigde: "",
        quantity: "",
        amount: "",
        napomena: "",
        price: 0,
        ordered: [],
        errors: {},
        orders: [],
        bonus: 0,
        orders_sum: 0,
        limit: 0,
        summary: 0
    };

    handleSubmit = e => {
        e.preventDefault();

        const { quantity, printer } = this.state;

        let data = {
            quantity,
            printer: printer ? printer.value : ""
        };
        axios
            .post("/api/orders", data)
            .then(response => {
                let orders = [...this.state.orders];
                let result = response.data;
                helpers.notify(result.message);
                orders.unshift(result.order);
                this.setState({
                    orders,
                    printer: "",
                    catrigde: "",
                    quantity: "",
                    napomena: "",
                    amount: "",
                    bonus: result.summary.bonus,
                    limit: result.summary.limit,
                    orders_sum: result.summary.orders_sum,
                    summary: result.summary.summary
                });
            })
            .catch(error => {
                helpers.notify(error.response.data.message, true);
            });
    };

    handleInputChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    onSelectChange = (value, action) => {
        let id = value.value;

        axios.get("/api/printers/" + id).then(response => {
            this.setState({
                catrigde: response.data.catridge,
                printer: value,
                price: response.data.price
            });
        });
    };

    handleQuantityChange = e => {
        let quantity = e.target.value;
        this.setState({ amount: this.state.price * quantity, quantity });
    };

    componentDidMount() {
        this.getPrintersForSelectList();
        this.getMonthOrder();
    }

    getPrintersForSelectList = () => {
        axios
            .get("/api/printers")
            .then(response => {
                let printers = response.data.printers;
                let p = printers.map(printer => ({
                    value: printer.id,
                    label: printer.name
                }));
                this.setState({
                    printers: p
                });
            })
            .catch(error => {});
    };

    getMonthOrder = () => {
        const date = new Date();
        axios
            .get("/api/orders?month=" + (date.getMonth() + 1))
            .then(response => {
                this.setState({
                    orders: response.data.orders,
                    showTableOrders:
                        response.data.orders.orders_count > 0 ?? true,
                    bonus: response.data.summary.bonus,
                    limit: response.data.summary.limit,
                    orders_sum: response.data.summary.orders_sum,
                    summary: response.data.summary.summary
                });
            })
            .catch(error => {
                helpers.notify(error.data.message);
            });
    };

    deleteCatridgeFromOrder = order => {
        helpers.notify("Uspešno izbrisano");
        const orders = [...this.state.orders];
        const deleted = orders.filter(o => o.id !== order.id);
        this.setState({
            orders: deleted
        });
        axios
            .delete("/api/orders/" + order.id)
            .then(response => {
                this.setState({
                    bonus: response.data.summary.bonus,
                    limit: response.data.summary.limit,
                    orders_sum: response.data.summary.orders_sum,
                    summary: response.data.summary.summary
                });
            })
            .catch(error => {
                helpers.notify(error.response.data.message, true);
            });
    };

    render() {
        const {
            printer,
            catrigde,
            quantity,
            amount,
            printers,
            napomena,
            orders,
            errors,
            bonus,
            limit,
            orders_sum,
            summary
        } = this.state;

        return (
            <div className="row">
                <div className="col-12">
                    <div
                        className="alert alert-primary alert-dismissible fade show"
                        role="alert"
                    >
                        <button
                            type="button"
                            className="close"
                            data-dismiss="alert"
                            aria-label="Close"
                        >
                            <span aria-hidden="true">&times;</span>
                            <span className="sr-only">Close</span>
                        </button>
                        <strong>
                            Trenutni limit: {helpers.formatNumber(limit)}.
                            Bonus: {helpers.formatNumber(bonus)}.
                            Preostalo za ovaj mesec: {helpers.formatNumber(summary)}
                        </strong>
                    </div>
                </div>

                <ToastContainer />
                <div className="col-6">
                    <div className="card">
                        <div className="card-header">
                            Dodaj novi toner u porudžbenicu
                        </div>
                        <div className="card-body">
                            <form
                                acceptCharset="utf-8"
                                onSubmit={this.handleSubmit}
                            >
                                <div className="form-group">
                                    <label htmlFor="printer">Štampač</label>
                                    <Select
                                        name="printer"
                                        options={printers}
                                        value={printer}
                                        onChange={this.onSelectChange}
                                        placeholder="Izaberi štampač"
                                    />
                                    <span
                                        className={
                                            errors && errors.printer
                                                ? "text-danger"
                                                : ""
                                        }
                                    >
                                        {errors.printer}
                                    </span>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="toner">Toner</label>
                                    <input
                                        type="text"
                                        name="catrigde"
                                        value={catrigde || ""}
                                        className="form-control"
                                        disabled={true}
                                        onChange={this.handleInputChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="toner">Količina</label>
                                    <select
                                        name="quantity"
                                        value={quantity}
                                        onChange={this.handleQuantityChange}
                                        className={
                                            errors && errors.quantity
                                                ? "form-control is-invalid"
                                                : "form-control"
                                        }
                                    >
                                        <option value="">
                                            Izaberi količinu
                                        </option>
                                        {_.range(1, 20 + 1).map(n => (
                                            <option key={n}>{n}</option>
                                        ))}
                                    </select>

                                    <span
                                        className={
                                            errors && errors.quantity
                                                ? "text-danger"
                                                : ""
                                        }
                                    >
                                        {errors.quantity}
                                    </span>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="toner">Vrednost</label>
                                    <input
                                        name="amount"
                                        value={amount}
                                        className="form-control"
                                        disabled={true}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="napomena">Napomena</label>
                                    <textarea
                                        rows="3"
                                        type="text"
                                        name="napomena"
                                        className="form-control"
                                        value={napomena}
                                        onChange={this.handleInputChange}
                                    ></textarea>
                                </div>
                                <div className="form-group float-right">
                                    <input
                                        type="submit"
                                        className="btn btn-primary"
                                        value="Snimi"
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-6">
                    <div className="card">
                        <div className="card-header">
                            Poručeno u ovom mesecu - {helpers.formatNumber(orders_sum) } ({orders.length})
                        </div>

                        <div className="card-body">
                            <div
                                className={
                                    orders.length == 0
                                        ? "alert alert-info"
                                        : "d-none"
                                }
                            >
                                <b> Nemate porudžbenice za ovaj mesec</b>
                            </div>
                            <table
                                className={
                                    orders.length == 0
                                        ? "d-none"
                                        : "table table-striped table-bordered"
                                }
                            >
                                <thead>
                                    <tr>
                                        <th>Štampač</th>
                                        <th>Toner</th>
                                        <th>Količina</th>
                                        <th>Cena</th>
                                        <th>Snimljeno</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <tr key={order.id}>
                                            <td scope="row">
                                                {order.printer.name}
                                            </td>
                                            <td>{order.printer.catridge}</td>
                                            <td>{order.quantity}</td>
                                            <td>
                                                <NumberFormat
                                                    value={
                                                        order.quantity *
                                                        order.printer.price
                                                    }
                                                    thousandSeparator={true}
                                                    displayType={"text"}
                                                />
                                            </td>
                                            <td>
                                                <Moment format="DD/MM/YYYY">
                                                    {order.created_at}
                                                </Moment>
                                            </td>
                                            <td>
                                                <a
                                                    onClick={() =>
                                                        this.deleteCatridgeFromOrder(
                                                            order
                                                        )
                                                    }
                                                >
                                                    <i className="fa fa-trash text-danger"></i>
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

if (document.getElementById("order-create")) {
    ReactDOM.render(<OrderCreate />, document.getElementById("order-create"));
}
