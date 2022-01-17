import { combineReducers } from 'redux';
import signupReducer from './signupReducer';
import loginReducer from './loginReducers';
import profileReducers from './profileReducers';
import restaurantProfileReducer from './restaurantProfileReducers'; 

//It will combine the reducers that are separated into funcations, each managing independant parts of the state.
export default combineReducers({
    
    signup: signupReducer,
    login: loginReducer,
    customerProfile: profileReducers,
    restaurantProfile: restaurantProfileReducer
});