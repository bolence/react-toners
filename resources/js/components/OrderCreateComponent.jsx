import axios from "axios";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import Select from "react-select";
import { ToastContainer } from "react-toastify";
import helpers from "./commons/Helpers";
import Moment from "react-moment";
import NumberFormat from "react-number-format";
import { Button, Modal } from "react-bootstrap";

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
        summary: 0,
        previousMonthOrders: {},
        showPreviousMonthOrder: false,
        lastMonthOrders: {},
        copiedFromLastMonth: false
    };


    componentDidMount() {
        this.getPrintersForSelectList();
        this.getMonthOrder();
    }

    handleSubmit = async (e) => {
        e.preventDefault();

        const { quantity, printer, napomena } = this.state;

        let data = {
            quantity,
            napomena,
            printer: printer ? printer.value : ""
        };
        await axios
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
                this.setState({ errors: error.response.data.errors });
                helpers.notify('Popunite zahtevana polja', true);
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
                price: response.data.price,
                errors: "",
                quantity: "",
                amount: "",
            });
        });
    };

    handleQuantityChange = e => {
        let quantity = e.target.value;
        this.setState({
            amount: this.state.price * quantity,
            quantity,
            errors: ""
        });
    };

    getPrintersForSelectList = async () => {
       await axios
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

    getMonthOrder = async () => {
        const date = new Date();
        await axios
            .get("/api/orders?month=" + (date.getMonth() + 1))
            .then(response => {
                this.setState({
                    orders: response.data.orders,
                    showTableOrders:
                        response.data.orders.orders_count > 0 ?? true,
                    bonus: response.data.summary.bonus,
                    limit: response.data.summary.limit,
                    orders_sum: response.data.summary.orders_sum,
                    summary: response.data.summary.summary,
                    copiedFromLastMonth: response.data.copied
                });
            })
            .catch(error => {
                helpers.notify(error.response.data.message, true);
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

    repeatOrderFromPreviousMonth = async (e) => {
        e.preventDefault();
        const date = new Date();
        const previousMonth = date.getMonth();
        await axios.get('/api/orders?month=' + previousMonth).then( response => {
            this.setState({
                previousMonthOrders: response.data,
                showPreviousMonthOrder: true,
                lastMonthOrders: response.data.orders,
                last_month_orders_sum: response.data.summary.orders_sum,
                last_month_summary: response.data.summary.summary,
            });
        }).catch( error => {

        });
    };

    handleOpenCloseModal = () => {
        this.setState({
            showPreviousMonthOrder: ! this.state.showPreviousMonthOrder,
        });
    };

    copyOrderFromLastMonth = async () => {
        await axios.get('/api/orders/copy_orders').then( response => {
            helpers.notify(response.data.message);
            this.setState({
                orders : response.data.orders,
                showPreviousMonthOrder: false,
                bonus: response.data.summary.bonus,
                limit: response.data.summary.limit,
                orders_sum: response.data.summary.orders_sum,
                summary: response.data.summary.summary,
                copiedFromLastMonth: response.data.copied
            });

        }).catch( error => {
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
            summary,
            price,
            showPreviousMonthOrder,
            lastMonthOrders,
            last_month_orders_sum,
            last_month_summary,
            copiedFromLastMonth
        } = this.state;

        const notEnoughMoney = last_month_orders_sum + orders_sum;
        const cantOrder = notEnoughMoney > limit

        return (
            <div className="row">
                 <Modal show={showPreviousMonthOrder} size="lg">
                    <Modal.Header
                        closeButton
                        onClick={() => this.handleOpenCloseModal()}
                    >
                        <Modal.Title>
                            Porudžbenica iz prošlog meseca - {helpers.formatNumber(last_month_orders_sum)} RSD.
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className={ cantOrder ? 'alert alert-danger alert-dismissible fade show' : 'd-none' } role="alert">
                            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                <span className="sr-only">Close</span>
                            </button>
                            <strong>Kopiranjem porudžbenice iz prošlog meseca nije moguće jer premašuje vaš limit od {" "}
                                <b>{helpers.formatNumber(limit)} RSD.</b><br />
                                Izbrišite trenutne tonere iz porudžbenice i dodajte samo tonere iz prošlog meseca.
                            </strong>
                        </div>
                        {lastMonthOrders.length > 0 ?

                        <table className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>Štampač</th>
                                    <th>Ketridž</th>
                                    <th>Količina</th>
                                    <th>Suma</th>
                                    <th>Kreirano</th>
                                </tr>
                                </thead>

                                <tbody>
                                    { lastMonthOrders.map( order =>
                                    <tr key={order.id}>
                                        <td scope="row">{order.printer.name}</td>
                                        <td>{order.printer.catridge}</td>
                                        <td>{order.quantity}</td>
                                        <td>{helpers.formatNumber(order.price * order.quantity)}</td>
                                        <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                    </tr>
                                    )}
                                </tbody>
                        </table> :
                        <div className="alert alert-info alert-dismissible fade show" role="alert">
                          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                          <strong> Nemate porudžbine za prošli mesec.</strong>
                        </div>}
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
                            className={lastMonthOrders.length == 0 || cantOrder ? 'd-none' : '' }
                            onClick={() => this.copyOrderFromLastMonth()}
                        >
                            Kopiraj porudžbenicu
                        </Button>
                    </Modal.Footer>
                </Modal>
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
                            Bonus: {helpers.formatNumber(bonus)}. Preostalo za
                            ovaj mesec: {helpers.formatNumber(summary - orders_sum)}
                        </strong>
                    </div>
                </div>

                <ToastContainer />
                <div className="col-6">
                    <div className="card">
                        <div className="card-header">
                            Dodaj novi toner u porudžbenicu
                            <span class={!copiedFromLastMonth ? 'float-right' : 'd-none' }>
                                <a class="btn btn-primary" href="" onClick={this.repeatOrderFromPreviousMonth}>
                                <i class="fa fa-copy"></i> Kopiraj iz prošlog meseca
                                </a>
                            </span>
                        </div>
                        <div className="card-body">
                            <form
                                acceptCharset="utf-8"
                                onSubmit={this.handleSubmit}
                            >
                                <div className={errors.length > 0 ? 'alert alert-danger alert-dismissible fade show' : 'd-none'} role="alert">
                                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                        <span className="sr-only">Close</span>
                                    </button>
                                   {errors.lenght > 0 && errors.map(error => (
                                       <p>{error}</p>
                                   ))}
                                </div>
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
                                    <label htmlFor="toner">Toner <span className="text-info">Automatsko popunjavanje</span></label>
                                    <input
                                        type="text"
                                        name="catrigde"
                                        value={catrigde || ""}
                                        className="form-control"
                                        disabled={true}
                                        onChange={this.handleInputChange}
                                    />
                                    <span
                                        className={
                                            printer ? "text-info" : "d-none"
                                        }
                                    >
                                        Cena ovog tonera je: {helpers.formatNumber(price)}
                                    </span>
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
                                    <label htmlFor="toner">Vrednost <span className="text-info">Automatsko popunjavanje</span></label>
                                    <input
                                        name="amount"
                                        value={amount}
                                        className="form-control"
                                        disabled={true}
                                    />
                                    <span className={quantity ? 'text-danger font-weight-bold' : 'd-none'}>
                                        {
                                        (summary - orders_sum) - amount > 0
                                        ? 'Preostali limit će biti: ' + helpers.formatNumber((summary - orders_sum) - amount)
                                        : 'Vaš preostali limit je manji od cene ovog tonera!!!'
                                        }

                                  </span>
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
                                    <button
                                        type="submit"
                                        disabled={(summary - orders_sum) - amount < 0}
                                        className='btn btn-primary'
                                    >
                                        <i class='fa fa-save'></i> Snimi porudžbenicu
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-6">
                    <div className="card">
                        <div className="card-header">
                            Poručeno u ovom mesecu
                            <span className={orders.length == 0 ? 'd-none' : ''}>-{" "}
                            {helpers.formatNumber(orders_sum)} ({orders.length + " toner/a"} )</span>
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
                                            <a title="Kopirano iz prošle porudžbenice" className={
                                               ! order.copied
                                                ? 'd-none'
                                                : ''
                                                }>
                                            <i className="fa fa-question-circle float-right text-danger font-weight-bold" ></i>
                                            </a>
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
                                                <a style={{ cursor: "pointer" }}
                                                    onClick={() =>
                                                        confirm('Da li želiš da izbrišeš ovaj toner?') && this.deleteCatridgeFromOrder(
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
