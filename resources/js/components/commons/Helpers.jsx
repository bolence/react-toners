import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
            autoClose: speed ? speed : 2000
        };

        let options = {...defaultToastOption, ...customOptions }
        !color ? toast.success(message, options) : toast.error(message, options);
    },



    formatNumber(inputNumber) {
        let formetedNumber=(Number(inputNumber)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        let splitArray=formetedNumber.split('.');
        if(splitArray.length>1){
          formetedNumber=splitArray[0];
        }
        return(formetedNumber + '.00');
      },

};

export default helpers;
