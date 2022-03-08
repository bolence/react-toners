import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import numeral from "numeral";
import moment from "moment";

const defaultToastOption = [
    {
        closeOnClick: true,
        hideProgressBar: true
    }
];

const CloseButton = ({ closeToast }) => (
    <i
      className="fa fa-remove"
      onClick={closeToast}
    >
    delete
    </i>
  );

const helpers = {
    getUser() {
        const user = JSON.parse(localStorage.getItem("toneri.user"));
        return user;
    },

    notify(message, color, speed, pos) {
        const customOptions = {
            position: pos ? pos : "top-right",
            autoClose: speed ? speed : 3000
        };

        let options = {...defaultToastOption, ...customOptions }
        !color ? toast.success(message, options) : toast.error(message, options);
    },

    formatNumber(inputNumber) {
        return numeral(inputNumber).format('0,0.00');
    },

    formatDate(date) {
        return moment(date).format('DD.MM.YYYY')
    },

    formatDateTime(date) {
        return moment(date).format('DD.MM.YYYY HH:mm')
    }

};

export default helpers;
