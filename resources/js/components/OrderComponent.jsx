import React, { Component } from "react";
import axios from "axios";
import ReactDOM from "react-dom";
import NumberFormat from "react-number-format";
import Moment from "react-moment";
import Pagination from "./commons/Pagination";
import { paginate } from "./functions/paginate";
import helpers from "./commons/Helpers";
import moment from "moment";
import { ToastContainer } from "react-toastify";
import Calendar from 'react-calendar';
import { Button, Modal } from "react-bootstrap";
import 'react-calendar/dist/Calendar.css';

export default class Order extends Component {
    state = {
        orders: [],
        orders_count: 0,
        title: "",
        month: moment().month() + 1,
        defaultPerPage: 10,
        currentPage: 1,
        searchKeyword: "",
        perPage: [10, 20, 50, 100, 500, 1000, 5000],
        user: helpers.getUser(),
        orders_sum: 0,
        filteredData: [],
        user: helpers.getUser(),
        showReminderCalendar: false,
        reminderDate: new Date(),
        reminder_date_message: "",
    };

    componentDidMount() {
        axios
            .get("/api/orders?month=" + this.state.month)
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
        let month = e.target.value;
        this.setState({ month });
        let searchMonth = month ? "?month=" + month : "";
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
        let search = e.target.value;
        let filteredData = [];
        const { orders } = this.state;

        filteredData = orders.filter(order => {
            let catridge = order.printer.catridge.toLowerCase();
            let printer = order.printer.name.toLowerCase();
            return (
                catridge.indexOf(search.toLowerCase()) !== -1 ||
                printer.indexOf(search.toLowerCase()) !== -1
            );
        });

        this.setState({
            filteredData,
            searchKeyword: search,
            currentPage: 1,
            orders_count: filteredData.length
        });
    };

    deleteCatridgeFromOrder = order => {
        const orders = [...this.state.orders];
        const deleted = orders.filter(o => o.id !== order.id);

        axios
            .delete("/api/orders/" + order.id)
            .then(response => {
                helpers.notify(response.data.message);
                this.setState({
                    orders: deleted,
                    orders_count: response.data.summary.orders_count
                });
            })
            .catch(error => {
                helpers.notify(error.response.data.message, true);
            });
    };

    handleOpenCloseModal = () => {
        this.setState({
            showReminderCalendar: ! this.state.showReminderCalendar,
        });
    };

    calendarChanged = () => {
        this.setState({
            reminderDate: this.reminderDate
        });
    }

    saveOrderReminder = () => {
        axios.post('/api/reminders').then( response => {
            this.setState({
                showReminderCalendar: false,
                reminder_date_message: response.data.reminder_date_message
            });
        }).catch( error => {
            this.setState({
                showReminderCalendar: false
            });
            helpers.notify( error.response.data.message, true);
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
            filteredData,
            showReminderCalendar,
            reminderDate,
            reminder_date_message
        } = this.state;

        const { length: count } =
            this.state.filteredData.length > 0
                ? filteredData
                : this.state.orders;

        const data = paginate(
            filteredData.length > 0 ? filteredData : orders,
            currentPage,
            defaultPerPage
        );

        const custom_title =
            month == "all"
                ? "Toneri za sve službe u " + (moment().month() + 1) + '.' + moment().year() + ".godini"
                : title;

        return (
            <div className="row">
                <ToastContainer />

                <Modal show={showReminderCalendar}>
                    <Modal.Header
                        closeButton
                        onClick={() => this.handleOpenCloseModal()}
                    >
                        <Modal.Title>
                            Podesite podsetnik za vašu porudžbenicu u ovom mesecu
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Calendar
                        onChange={this.calendarChanged}
                        value={reminderDate}
                        />

                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => this.handleOpenCloseModal()}
                        >
                            Zatvori
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => this.saveOrderReminder()}
                        >
                            Snimi podsetnik
                        </Button>
                    </Modal.Footer>
                </Modal>
                <div
                    className="col-md-12 col-lg-12">
                        <div class={reminder_date_message !== "" ? 'alert alert-success alert-dismissible fade show' : 'd-none'} role="alert">
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <strong>{reminder_date_message}</strong>
                        </div>
                    <div className="card">
                        <div className="card-header">
                            <b>
                                {custom_title} - {orders_count} tonera
                            </b>
                            <span className="float-right">
                                <button className="btn btn-primary" onClick={this.handleOpenCloseModal}>
                                    <i className="fa fa-calendar"></i> Dodaj podsetnik
                                </button>
                            </span>
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
                                                <option value="all">
                                                    Sve službe
                                                </option>
                                                {_.range(1, 12 + 1).map(m => (
                                                    <option
                                                        key={m}
                                                        value={m}
                                                        defaultValue={month}
                                                    >
                                                        {m}.mesec
                                                    </option>
                                                ))}
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
                                <div className={data.length == 0 ? 'alert alert-primary alert-dismissible fade show mt-4' : 'd-none'} role="alert">
                                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                        <span className="sr-only">Close</span>
                                    </button>
                                    <strong>Nema porudžbenica za traženi mesec.</strong>
                                </div>
                                <table className={data.length > 0 ? 'table table-bordered table-striped table-hover' : 'd-none' }>
                                    <thead>
                                        <tr>
                                            <th>Služba</th>
                                            <th>Štampač(toner)</th>
                                            <th>Količina</th>
                                            <th>Cena</th>
                                            <th>Ukupno</th>
                                            <th>Napomena</th>
                                            <th>Snimljeno</th>
                                            <th>Edit</th>
                                        </tr>
                                    </thead>
                                    <tbody >
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
                                                    { order.napomena }
                                                </td>
                                                <td>
                                                    <Moment format="DD/MM/YYYY">
                                                        {order.created_at}
                                                    </Moment>
                                                </td>

                                                <td
                                                    className={
                                                        order.account_id !==
                                                        user.account_id
                                                            ? "d-none"
                                                            : ""
                                                    }
                                                >
                                                    <a style={{ cursor: 'pointer' }}
                                                        onClick={() =>
                                                            confirm('Da li želiš da izbrišeš ovaj toner?')
                                                            && this.deleteCatridgeFromOrder(order)
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
