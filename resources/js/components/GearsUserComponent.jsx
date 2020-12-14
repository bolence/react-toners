import React, { Component } from "react";
import ReactDOM from "react-dom";
import { ToastContainer } from "react-toastify";

export default class GearUser extends Component {
    state = {};
    componentDidMount() {}

    render() {
        return (
            <div className="row">
                <ToastContainer />
                <div className="col-md-12 col-lg-12">
                    <div className="card">
                        <div className="card-header">
                            <b></b>
                        </div>
                        <div className="card-body">
                            <table className="table table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td scope="row"></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

if (document.getElementById("user-gears")) {
    ReactDOM.render(<GearUser />, document.getElementById("user-gears"));
}
