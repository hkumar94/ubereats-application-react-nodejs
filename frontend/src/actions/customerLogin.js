import { USER_LOGIN, USER_LOGOUT } from "./userTypes";
import endPointObj from '../endPointUrl.js';
import axios from "axios";

export const customerLogin = (loginData) => dispatch => {

    //It will dispatch the action to login reducer.
    axios.defaults.withCredentials = true;
    axios.post(endPointObj.url + '/login/customer', loginData)
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

export const userLogout = () => dispatch => dispatch({type: USER_LOGOUT});
