import React, { Component } from "react";
import ReactDOM from "react-dom";
import moment from "moment";
import axios from "axios";
import helpers from "./commons/Helpers";

export default class Statistic extends Component {
    state = {
        month: moment().month() + 1,
        data: []
    };
    componentDidMount() {
        axios
            .get("/api/statistics")
            .then(response => {
                this.setState({ data: response.data });
            })
            .then(error => {});
    }
    render() {
        return (
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Sektor</th>
                        <th>Služba</th>
                        <th>Količina tonera mesečno</th>
                        <th>Ukupna suma mesečno</th>
                        <th>Mesec</th>
                        <th>Godina</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.data.map(s => (
                        <tr key={s.id}>
                            <td scope="row">{s.sektor}</td>
                            <td>{s.sluzba}</td>
                            <td>{s.orders_count}</td>
                            <td>{helpers.formatNumber(s.orders_sum)}</td>
                            <td>{s.month}</td>
                            <td>{s.year}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }
}

if (document.getElementById("statistics")) {
    ReactDOM.render(<Statistic />, document.getElementById("statistics"));
}
