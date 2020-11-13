import React, { Component } from "react";
import axios from "axios";
import ReactDOM from "react-dom";
import NumberFormat from "react-number-format";
import Moment from "react-moment";
import Pagination from "./commons/Pagination";
import { paginate } from "./functions/paginate";

export default class Order extends Component {
    state = {
        orders: [],
        orders_count: 0,
        title: "",
        month: "",
        defaultPerPage: 10,
        currentPage: 1,
        perPage: [10, 20, 50, 100, 500, 1000, 5000]
    };

    componentDidMount() {
        axios
            .get("/api/orders")
            .then(response => {
                this.setState({
                    orders: response.data.orders,
                    orders_count: response.data.orders_count,
                    title: response.data.title
                });
            })
            .catch(error => {});
    }

    onChange = () => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleOnPageChange = page => {
        this.setState({ currentPage: page });
    };

    handlePageSizeChange = e => {
        this.setState({ defaultPerPage: e.target.value, currentPage: 1 });
    };

    handleMonthChange = e => {
        this.setState({ month: e.target.value });
        let searchMonth = e.target.value ? '?month=' + e.target.value : "";
        axios.get("/api/orders" + searchMonth).then(response => {
            this.setState({
                orders: response.data.orders,
                orders_count: response.data.orders_count,
                currentPage: 1
            });
        });
    };

    render() {
        const {
            orders,
            orders_count,
            title,
            month,
            perPage,
            defaultPerPage,
            currentPage
        } = this.state;

        const { length: count } = this.state.orders;

        const data = paginate(orders, currentPage, defaultPerPage);

        return (
            <div className="row">
                <div className="col-md-12 col-lg-12">
                    <div className="card">
                        <div className="card-header">
                            <b>
                                {title} - {orders_count} tonera
                            </b>
                        </div>
                        <div className="card-body">
                            <div className="row mb-2">
                                <div className="col-auto mr-auto">
                                    <select
                                        name={defaultPerPage}
                                        value={defaultPerPage}
                                        onChange={this.handlePageSizeChange}
                                        className="form-control"
                                    >
                                        {perPage.map(pp => (
                                            <option key={pp} value={pp}>
                                                {pp}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-auto">
                                    <div className="row">
                                        <div className="col-6">
                                            <select
                                                onChange={
                                                    this.handleMonthChange
                                                }
                                                value={month}
                                                className="form-control"
                                            >
                                                <option>Izaberi mesec</option>
                                                <option value="">Sve</option>
                                                <option value="1">1.mesec</option>
                                                <option value="2">2.mesec</option>
                                                <option value="3">3.mesec</option>
                                                <option value="4">4.mesec</option>
                                                <option value="5">5.mesec</option>
                                                <option value="6">6.mesec</option>
                                                <option value="7">7.mesec</option>
                                                <option value="8">8.mesec</option>
                                                <option value="9">9.mesec</option>
                                                <option value="10">10.mesec</option>
                                                <option value="11">11.mesec</option>
                                                <option value="12">12.mesec</option>
                                            </select>
                                        </div>
                                        <div className="col-6">
                                            <input
                                                className="form-control"
                                                name="search"
                                                placeholder="Pretraga"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <table className="table table-bordered table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th>Služba</th>
                                            <th>Štampač(toner)</th>
                                            <th>Količina</th>
                                            <th>Cena</th>
                                            <th>Ukupno</th>
                                            <th>Snimljeno</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map(order => (
                                            <tr key={order.id}>
                                                <td scope="row">
                                                    {order.account.sluzba}
                                                </td>
                                                <td>
                                                    {order.printer.name} (
                                                    {order.printer.catridge})
                                                </td>
                                                <td>{order.quantity}</td>
                                                <td>
                                                    <NumberFormat
                                                        value={order.price}
                                                        thousandSeparator={true}
                                                        displayType={"text"}
                                                    />
                                                </td>
                                                <td>
                                                    <NumberFormat
                                                        value={
                                                            order.quantity *
                                                            order.price
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
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination
                                itemsCount={count}
                                pageSize={defaultPerPage}
                                currentPage={currentPage}
                                onPageChange={this.handleOnPageChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

if (document.getElementById("orders")) {
    ReactDOM.render(<Order />, document.getElementById("orders"));
}
