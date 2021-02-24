
import React, { Component } from "react";
import ReactDOM from "react-dom";
import axios from 'axios';
import helpers from "./commons/Helpers";

export default class Timer extends Component {

    state = {
        counter: 0,
    };

    componentDidMount() {
        setInterval(
            () => this.checkInterval(),
            5000);
    }

    checkInterval = () => {
        console.log(this.state.counter);
        // let latest_session_time = localStorage.getItem('toneri.latest_session_time');
        // let date = new Date(latest_session_time);
        // let current_time = new Date();
        // let logged_time = date;
        // let diff = current_time.getTime() - logged_time.getTime();
        // let diff_in_minutes = new Date(diff).getMinutes();
        // if(diff_in_minutes >= 5)
        // {
        //     helpers.notify('Vaša sesija')
        // }
        // console.log(new Date(diff).getMinutes());
    };

    componentWillUnmount() {
        console.log('Timer did unmonunt');
        clearInterval(this.interval);
    };

    render() {
        return null;
    }

}

if (document.getElementById("timer")) {
    ReactDOM.render(<Timer />, document.getElementById("logout"));
}
