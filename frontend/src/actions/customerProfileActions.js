import { GET_CUSTOMER, UPDATE_CUSTOMER } from "./userTypes";
import endPointObj from '../endPointUrl.js';
import axios from "axios";

export const getCustomer = () => dispatch => {
    axios.get(endPointObj.url + '/profile/customer/getCustomerProfileDetails/'+ localStorage.getItem("user_id"))
        .then(customer => dispatch({
            type: GET_CUSTOMER,
            payload: customer.data.data
        }))
        .catch(error => {
            console.log(error);
        });
}

export const updateCustomer = (updateCustomerData) => dispatch => {
    console.log("Inside dispatching the update payload action");
    axios.defaults.withCredentials = true;
    axios.post(endPointObj.url +'/profile/customer/updateCustomerProfile', updateCustomerData)
        .then(response => response.data)
        .then(data => {
            if (data === 'CUSTOMER_UPDATED') {
                localStorage.setItem("name", updateCustomerData.name);
                alert("Profile Updated Successfully!");
            }
            return dispatch({
                type: UPDATE_CUSTOMER,
                payload: data
            })
        })
        .catch(error => {
            console.log(error);
        });
}