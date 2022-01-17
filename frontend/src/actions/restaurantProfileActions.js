import { GET_RESTAURANT, UPDATE_RESTAURANT } from "./userTypes";
import endPointObj from '../endPointUrl.js';
import axios from "axios";

export const getRestaurant = () => dispatch => {
    axios.get(endPointObj.url + '/profile/restaurant/getRestaurantProfileDetails/'+ localStorage.getItem("user_id"))
        .then(restaurant => dispatch({
            type: GET_RESTAURANT,
            payload: restaurant.data.data
        }))
        .catch(error => {
            console.log(error);
        });
}

export const updateRestaurant = (restaurantProfileData) => dispatch => {
    axios.defaults.withCredentials = true;
    axios.post(endPointObj.url +'/profile/restaurant/updateRestaurantProfile', restaurantProfileData)
        .then(response => response.data)
        .then(data => {
            if (data === 'RESTAURANT_UPDATED') {
                localStorage.setItem("name", restaurantProfileData.name);
                alert("Profile Updated Successfully!");
            }
            return dispatch({
                type: UPDATE_RESTAURANT,
                payload: data
            })
        })
        .catch(error => {
            console.log(error);
        });
}