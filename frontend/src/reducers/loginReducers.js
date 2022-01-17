import { USER_LOGIN, USER_LOGOUT } from '../actions/userTypes';

 const initialState = {
     user: {}
 };

 //Updates the central state of redux
 export default function(state = initialState, action){
    switch(action.type){
        case USER_LOGIN:
            return {
                ...state,
                user: action.payload
            };
        case USER_LOGOUT:
            return {};
        default:
            return state;
    }
 };
 