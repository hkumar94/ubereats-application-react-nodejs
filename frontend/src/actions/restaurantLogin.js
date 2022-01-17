import { USER_LOGIN, USER_LOGOUT } from "./userTypes";
import endPointObj from '../endPointUrl.js';
import axios from "axios";

export const restaurantLogin = (loginData) => dispatch => {
    axios.defaults.withCredentials = true;
    axios.post(endPointObj.url + '/login/restaurant', loginData)
        .then(response => dispatch({
            type: USER_LOGIN,
            payload: response.data
        }))
        .catch(error => {
            if (error.response && error.response.data) {
                return dispatch({
                    type: USER_LOGIN,
                    payload: error.response.data
                });
            }
        });
}

