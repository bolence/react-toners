import React, { Component } from "react";
import ReactDOM from "react-dom";
import helpers from "./commons/Helpers";
import axios from "axios";
import moment from "moment";
import { paginate } from "./functions/paginate";
import Pagination from "./commons/Pagination";
import { ToastContainer } from "react-toastify";
import { Button, Modal } from "react-bootstrap";

export default class Printers extends Component {
    state = {
        printers: [],
        search: "",
        defaultPerPage: 30,
        currentPage: 1,
        filteredData: [],
        showUpdatePrinter: false,
        showNewPrinter: false,
        name: "",
        price: "",
        printer: {},
        catridge: "",
        errors: {},
        new_price: "",
        new_name: "",
        new_catridge: ""
    };

    componentDidMount() {
        axios
            .get("/api/printers")
            .then(response => {
                this.setState({ printers: response.data.printers });
            })
            .catch(error => {});
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSearch = e => {
        let search = e.target.value;
        let filteredData = [];
        const { printers } = this.state;

        filteredData = printers.filter(printer => {
            const lowerCase =
                printer.name.toLowerCase() || printer.catridge.toLowerCase();
            const filter = search.toLowerCase();
            return lowerCase.includes(filter);
        });

        this.setState({ filteredData, search, currentPage: 1 });
    };

    handleOnPageChange = page => {
        this.setState({ currentPage: page });
    };

    handleModalShowHide = printer => {
        this.setState({
            showUpdatePrinter: !this.state.showUpdatePrinter,
            name: printer.name,
            price: printer.price,
            catridge: printer.catridge,
            printer
        });
    };

    handleNewPrinter = () => {
        this.setState({ showNewPrinter: !this.state.showNewPrinter, errors: {} });
    };

    savePrinter = () => {
        const { new_name, new_price, new_catridge } = this.state;

        let data = {
            name: new_name,
            price: new_price,
            catridge: new_catridge,
        };
        axios
            .post("/api/printers", data)
            .then(response => {
                helpers.notify(response.data.message);
                let printers = [...this.state.printers];
                printers.unshift(response.data.printer);
                this.setState({
                    printers,
                    showNewPrinter: !this.state.showNewPrinter
                });
            })
            .catch(error => {
                helpers.notify(error.response.data.message, true);
                this.setState({ errors: error.response.data.errors });
            });
    };

    updatePrice = () => {
        const { name, price, catridge, printer } = this.state;
        let id = printer.id;

        let data = {
            price: price,
            name: name,
            catridge: catridge,
        };
        axios
            .patch("/api/printers/" + id, data)
            .then(response => {
                helpers.notify(response.data.message);
                this.setState({
                    printers: response.data.printers,
                    showUpdatePrinter: !this.state.showUpdatePrinter
                });
            })
            .catch(error => {
                helpers.notify(error.response.data.message, true);
            });
    };

    deletePrinter = printer => {
        let printers = [...this.state.printers];
        axios
            .delete("/api/printers/" + printer.id)
            .then(response => {
                helpers.notify(response.data.message);
                const deleted = printers.filter(p => printer.id !== p.id);
                this.setState({ printers: deleted });
            })
            .catch(error => {
                helpers.notify(error.response.data.message, true);
            });
    };

    render() {
        const {
            printers,
            search,
            currentPage,
            defaultPerPage,
            filteredData,
            price,
            name,
            showUpdatePrinter,
            printer,
            showNewPrinter,
            catridge,
            errors,
            new_price,
            new_name,
            new_catridge,
        } = this.state;
        const { length: count } =
            this.state.filteredData.length > 0
                ? filteredData
                : this.state.printers;

        const data = paginate(
            filteredData.length > 0 ? filteredData : printers,
            currentPage,
            defaultPerPage
        );
        return (
            <div className="row">
                <ToastContainer />
                <Modal show={showNewPrinter} onHide={() => this.handleNewPrinter()}>
                    <Modal.Header
                        closeButton
                        onClick={() => this.handleNewPrinter()}
                    >
                        <Modal.Title>Dodaj novi štampač</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <label htmlFor="">Ime štampača</label>
                        <input
                            className={
                                errors && errors.name
                                    ? "form-control is-invalid"
                                    : "form-control"
                            }
                            name="new_name"
                            type="text"
                            value={new_name}
                            onChange={this.onChange}
                        />
                        <div
                            className={
                                errors && errors.name ? "text-danger" : ""
                            }
                        >
                            {errors.name}
                        </div>
                        <label htmlFor="">Toner</label>
                        <input
                            className={
                                errors && errors.catridge
                                    ? "form-control is-invalid"
                                    : "form-control"
                            }
                            name="new_catridge"
                            type="text"
                            value={new_catridge}
                            onChange={this.onChange}
                        />
                        <div
                            className={
                                errors && errors.catridge ? "text-danger" : ""
                            }
                        >
                            {errors.catridge}
                        </div>
                        <label htmlFor="">Cena tonera</label>
                        <input
                            className={
                                errors && errors.price
                                    ? "form-control is-invalid"
                                    : "form-control"
                            }
                            name="new_price"
                            type="text"
                            value={new_price}
                            onChange={this.onChange}
                        />
                        <div
                            className={
                                errors && errors.price ? "text-danger" : ""
                            }
                        >
                            {errors.price}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => this.handleNewPrinter()}
                        >
                            Zatvori
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => this.savePrinter()}
                        >
                            Dodaj Štampač
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showUpdatePrinter}>
                    <Modal.Header
                        closeButton
                        onClick={() => this.handleModalShowHide(printer)}
                    >
                        <Modal.Title>
                            Izmeni naziv štampača ili cenu tonera{" "}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <label htmlFor="">Ime štampača</label>
                        <input
                            className="form-control"
                            name="name"
                            type="text"
                            value={name}
                            onChange={this.onChange}
                        />
                         <label htmlFor="">Naziv tonera</label>
                        <input
                            className="form-control"
                            name="catridge"
                            type="text"
                            value={catridge}
                            onChange={this.onChange}
                        />
                        <label htmlFor="">Cena tonera</label>
                        <input
                            className="form-control"
                            name="price"
                            type="text"
                            value={price}
                            onChange={this.onChange}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => this.handleModalShowHide(printer)}
                        >
                            Zatvori
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => this.updatePrice()}
                        >
                            Izmeni štampač
                        </Button>
                    </Modal.Footer>
                </Modal>
                <div className="col-md-12 col-lg-12">
                    <div className="card">
                        <div className="card-header">
                            Spisak štampača sa tonerima i cenama
                            <span className="float-right">
                                <button
                                    className="btn btn-primary"
                                    onClick={this.handleNewPrinter}
                                >
                                    <i className="fa fa-print"></i> Novi štampač
                                </button>
                            </span>
                        </div>
                        <div className="card-body">
                            <p className="card-title float-right">
                                <input
                                    placeholder="Pretraga"
                                    className="form-control"
                                    type="search"
                                    value={search}
                                    name="search"
                                    onChange={this.handleSearch}
                                />
                            </p>
                            <table className="table table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th>Štampač</th>
                                        <th>Toner</th>
                                        <th>Cena</th>
                                        <th>Kreiran</th>
                                        <th>Izmenjen</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map(printer => (
                                        <tr key={printer.id}>
                                            <td scope="row">{printer.name}</td>
                                            <td>{printer.catridge}</td>
                                            <td>
                                                {helpers.formatNumber(
                                                    printer.price
                                                )}
                                            </td>
                                            <td>
                                                {moment(
                                                    printer.created_at
                                                ).format("DD/MM/YYYY")}
                                            </td>

                                            <td>
                                                {moment(
                                                    printer.updated_at
                                                ).format("DD/MM/YYYY HH:mm:ss")}
                                            </td>

                                            <td>
                                                <a
                                                    onClick={() =>
                                                        this.handleModalShowHide(
                                                            printer
                                                        )
                                                    }
                                                >
                                                    <i
                                                        className="fa fa-pen"
                                                        style={{
                                                            color: "blue"
                                                        }}
                                                    ></i>
                                                </a>
                                                &nbsp;
                                                <a
                                                    onClick={() =>
                                                        confirm('Da li želiš da izbrišeš ovaj toner?')
                                                        && this.deletePrinter(printer)
                                                    }
                                                >
                                                    <i
                                                        className="fa fa-trash"
                                                        style={{ color: "red" }}
                                                    ></i>
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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

if (document.getElementById("printers")) {
    ReactDOM.render(<Printers />, document.getElementById("printers"));
}
