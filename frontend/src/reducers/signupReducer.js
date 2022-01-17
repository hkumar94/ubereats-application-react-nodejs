import { CUSTOMER_SIGNUP, RESTAURANT_SIGNUP } from '../actions/userTypes';

const initialState = {
    user: {}
};

export default function (state = initialState, action) {
    switch (action.type) {
        case CUSTOMER_SIGNUP:
            return {
                ...state,
                user: action.payload
            };
        case RESTAURANT_SIGNUP:
            return {
                ...state,
                user: action.payload
            };
        default:
            return state;
    }
};