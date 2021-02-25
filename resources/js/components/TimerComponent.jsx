
import React, { Component } from "react";
import ReactDOM from "react-dom";
import axios from 'axios';
import helpers from "./commons/Helpers";

export default class Timer extends Component {

    componentDidMount() {
        setInterval(
            () => this.checkInterval(),
            10000);
    }

    checkInterval = () => {
        let latest_session_time = localStorage.getItem('toneri.latest_session_time');
        let date = new Date(latest_session_time);
        let current_time = new Date();
        let logged_time = date;
        let diff = current_time.getMinutes() - logged_time.getMinutes();
        if(diff >= 15)
        {
            if( window.confirm('Osvežite sesiju kako ne bi bili izlogovani') )
            {
                localStorage.setItem('toneri.latest_session_time', new Date(date.setMinutes(date.getMinutes() + 15)));
                helpers.notify('Uspešno ste produžili sesiju za 15 minuta');
                localStorage.setItem('last_page_visited', $(location).attr('href'));
            }
        }

    };

    render() {
        return null;
    }

}

if (document.getElementById("timer")) {
    ReactDOM.render(<Timer />, document.getElementById("timer"));
}
