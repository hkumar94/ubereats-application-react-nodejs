import { CUSTOMER_SIGNUP, RESTAURANT_SIGNUP } from "./userTypes";
import endPointObj from '../endPointUrl.js';
import axios from "axios";

export const customerSignup = (customerData) => dispatch => {
    axios.defaults.withCredentials = true;
    axios.post(endPointObj.url + '/signup/customer', customerData)
        .then(response => dispatch({
            type: CUSTOMER_SIGNUP,
            payload: response.data
        }))
        .catch(error => {
            if (error.response && error.response.data) {
                return dispatch({
                    type: CUSTOMER_SIGNUP,
                    payload: error.response.data
                });
            }
            return;
        });
}

export const restaurantSignup = (restaurantData) => dispatch => {
    axios.defaults.withCredentials = true;
    axios.post(endPointObj.url + '/signup/restaurant', restaurantData)
        .then(response => dispatch({
            type: RESTAURANT_SIGNUP,
            payload: response.data
        }))
        .catch(error => {
            if (error.response && error.response.data) {
                return dispatch({
                    type: RESTAURANT_SIGNUP,
                    payload: error.response.data
                });
            }
            return;
        });
}