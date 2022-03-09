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
import { Calendar } from "react-modern-calendar-datepicker";
import { Button, Modal } from "react-bootstrap";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";


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
        showReminderCalendar: false,
        reminderDate: null,
        reminder_date_message: "",
        automaticCopy: false,
        dateGreaterThan: false,
        show_info: false,
        showLoader: true,
        count_toners: 0,
        copied: false,
        has_previous_month_orders: false,
        automatic_copy_set: false,

    };

    componentDidMount() {
        axios
            .get("/api/orders?month=" + this.state.month)
            .then(response => {
                this.setState({
                    title: response.data.title,
                    orders: response.data.orders,
                    orders_count: response.data.summary.orders_count,
                    orders_sum: response.data.summary.orders_sum,
                    count_toners: response.data.count_toners,
                    showLoader: false,
                    copied: response.data.copied,
                    has_previous_month_orders: response.data.previous_month_orders,
                    automatic_copy_set: response.data.automatic_copy
                });
            })
            .catch(error => {
                this.setState({
                    showLoader: false
                })
                helpers.notify(error.response.message, true);
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
        if(month == '') return;
        this.setState({ month, showLoader: true });
        let searchMonth = month ? "?month=" + month : "";
        axios.get("/api/orders" + searchMonth).then(response => {
            this.setState({
                orders: response.data.orders,
                orders_sum: response.data.summary.orders_sum,
                title: response.data.title,
                currentPage: 1,
                showLoader: false,
                count_toners: response.data.count_toners,
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

    calendarChanged = (date) => {
        let today = moment();
        let selected_date = moment(date).subtract(1, 'month');

        if(selected_date < today)
        {
            this.setState({
                dateGreaterThan: true,
            });
        }
        else {
            this.setState({
                dateGreaterThan: false,
            })
        }
        this.setState({
            reminderDate: date
        });

    }

    saveOrderReminder = () => {

        let data = {
            reminder_date: moment(this.state.reminderDate).subtract(1, 'month').format('YYYY-MM-DD'),
            user: this.state.user
        }

        if(data.reminder_date == 'Invalid date') {
            helpers.notify('Datum nije izabran! Datum je obavezan!', true);
            return;
        }

        axios.post('/api/reminders', data).then( response => {
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
            reminder_date_message,
            dateGreaterThan,
            error,
            orders_sum,
            showLoader,
            count_toners,
            copied,
            has_previous_month_orders,
            automatic_copy_set
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

        return (
            <div className="row">
                <ToastContainer />

                <Modal show={showReminderCalendar} onHide={() => this.handleOpenCloseModal()}>
                    <Modal.Header
                        closeButton
                        onClick={() => this.handleOpenCloseModal()}
                    >
                        <Modal.Title>
                            Izaberite datum automatskog kopiranja
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                    <div className={has_previous_month_orders ? 'alert alert-primary alert-dismissible fade show' : 'd-none' } role="alert">
                                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                    <span className="sr-only">Close</span>
                                </button>
                                <strong>Vaša porudžbenica iz prošlog meseca će biti kopirana kao porudžbenica za ovaj mesec. Radnja će biti izvršena na izabrani datum.</strong>
                    </div>

                        <div className={dateGreaterThan ? 'alert alert-danger alert-dismissible fade show' : 'd-none'} role="alert">
                            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                <span className="sr-only">Close</span>
                            </button>
                            <strong>Izabrali ste datum u prošlosti!</strong>
                        </div>
                        <span className={has_previous_month_orders ? '' : 'd-none'}>
                        <Calendar
                        onChange={this.calendarChanged}
                        value={reminderDate}
                        width={1000}
                        shouldHighlightWeekends
                        />
                        </span>
                        <br/>
                        <span className={error ? 'text-danger' : ''}>
                            {error}
                        </span>
                    <div className={!has_previous_month_orders ? 'alert alert-danger' : 'd-none'} role="alert">
                        <strong>Nemate poručene tonere iz prošlog meseca</strong>
                    </div>
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
                            disabled={dateGreaterThan}
                            onClick={() => this.saveOrderReminder()}
                        >
                            Snimi podsetnik
                        </Button>

                    </Modal.Footer>
                </Modal>

                <div
                    className="col-md-12 col-lg-12">
                        <div className={reminder_date_message !== "" ? 'alert alert-success alert-dismissible fade show' : 'd-none'} role="alert">
                        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <strong>{reminder_date_message}</strong>
                        </div>
                    <div className="card">
                        <div className="card-header">
                            <b>
                                {title} - {count_toners} toner/a
                                <span className={orders_sum == 0 ? 'd-none' : '' }> - vrednost {helpers.formatNumber(orders_sum) + ' RSD.'}</span>
                            </b>
                            <span className={!copied && orders.length == 0 && !automatic_copy_set  ? 'float-right' : 'd-none' }>
                                <button className="btn btn-primary" onClick={this.handleOpenCloseModal}>
                                    <i className="fa fa-calendar"></i> Automatsko kopiranje
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
                                <span className="text-center">
                                    <Loader type="ThreeDots" color="#00BFFF" height={60} width={60} visible={showLoader} />
                                </span>
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
                                                <a title="Kopirano iz prošle porudžbenice" className={
                                            ! order.copied
                                            ? 'd-none'
                                            : ''
                                            }>
                                            <i className="fa fa-question-circle float-right text-danger font-weight-bold" ></i>
                                            </a>
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
