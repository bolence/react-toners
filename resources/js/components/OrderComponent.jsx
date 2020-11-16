import React, { Component } from "react";
import axios from "axios";
import ReactDOM from "react-dom";
import NumberFormat from "react-number-format";
import Moment from "react-moment";
import Pagination from "./commons/Pagination";
import { paginate } from "./functions/paginate";
import helpers from './commons/Helpers';
import { ToastContainer } from "react-toastify";


export default class Order extends Component {
    state = {
        orders: [],
        orders_count: 0,
        title: "",
        month: "",
        defaultPerPage: 10,
        currentPage: 1,
        searchKeyword: "",
        perPage: [10, 20, 50, 100, 500, 1000, 5000],
        user: helpers.getUser(),
        orders_sum: 0,
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
            .catch(error => {
                helpers.notify(error.data.message, true);
            });
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
        let searchMonth = e.target.value ? "?month=" + e.target.value : "";
        axios.get("/api/orders" + searchMonth).then(response => {
            this.setState({
                orders: response.data.orders,
                orders_count: response.data.orders_count,
                orders_sum: response.data.orders_sum,
                title: response.data.title,
                currentPage: 1
            });
        });
    };

    handleSearch = e => {
        let searchKeyword = e.target.value;
        let orders = [...this.state.orders];
        orders = orders.filter(order => {
            let catridge = order.printer.catridge.toLowerCase();
            return catridge.indexOf(searchKeyword.toLowerCase()) !== -1;
        });

        this.setState({
            orders,
            searchKeyword,
            orders_count: orders.length
        });
    };

    deleteCatridgeFromOrder = order => {
        helpers.notify('Uspešno izbrisano', null);
        const orders = [...this.state.orders];
        const deleted = orders.filter(o => o.id !== order.id);
        this.setState({
            orders: deleted
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
            currentPage,
            searchKeyword,
            user,
            orders_sum,
        } = this.state;

        const { length: count } = this.state.orders;

        const data = paginate(orders, currentPage, defaultPerPage);


        return (
            <div className="row">
                <ToastContainer />
                <div className="col-md-12 col-lg-12">
                    <div className="card">
                        <div className="card-header">
                            <b>
                                {title} - {orders_count} tonera{" "}
                                {month ? "- " + month + ".mesec" : ""}
                                {/* {orders_sum} */}
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
                                                <option value="1">
                                                    1.mesec
                                                </option>
                                                <option value="2">
                                                    2.mesec
                                                </option>
                                                <option value="3">
                                                    3.mesec
                                                </option>
                                                <option value="4">
                                                    4.mesec
                                                </option>
                                                <option value="5">
                                                    5.mesec
                                                </option>
                                                <option value="6">
                                                    6.mesec
                                                </option>
                                                <option value="7">
                                                    7.mesec
                                                </option>
                                                <option value="8">
                                                    8.mesec
                                                </option>
                                                <option value="9">
                                                    9.mesec
                                                </option>
                                                <option value="10">
                                                    10.mesec
                                                </option>
                                                <option value="11">
                                                    11.mesec
                                                </option>
                                                <option value="12">
                                                    12.mesec
                                                </option>
                                            </select>
                                        </div>
                                        <div className="col-6">
                                            <input
                                                className="form-control"
                                                type="search"
                                                value={searchKeyword}
                                                onChange={this.handleSearch}
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
                                            <th></th>
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

                                                <td className={order.account_id !== user.account_id ? 'd-none' : ''}>
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
