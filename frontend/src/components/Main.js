import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import CustomerSignup from './Signup/CustomerSignup';
import RestaurantSignup from './Signup/RestaurantSignup.js';
import CustomerLogin from './Login/CustomerLogin.js';
import RestaurantLogin from './Login/RestaurantLogin.js';
import CustomerHome from './Landing/CustomerHome.js';
import RestaurantHome from './Landing/RestaurantHome';
import CustomerNavigationBarHome from './Navbar/CustomerNavbarHome.js';
import RestoNavigationBarHome from './Navbar/RestaurantNavbarHome.js';
import CustomerProfile from './profile/CustomerProfile.js';
import RestaurantProfile from './profile/RestaurantProfile';
import Menu from './Menu/Menu.js';
import EditMenuItems from './Menu/EditMenuItems.js';
import Restaurant from './Restaurant/Restaurant.js';
import Cart from './Cart/Cart.js';
import ConfirmOrder from './Cart/ConfirmOrder';
import CustomerOrders from './Orders/CustomerOrders.js';
import OrderBillView from './Orders/OrderBillView';
import OrderItemsView from './Orders/OrderItemsView';
import OrderHistory from './Orders/OrderHistory';
import RestaurantOrderHistory from './Orders/RestaurantOrderHistory';
import OrderItemsRestaurantView from './Orders/OrderItemsViewRestaurant';
import LandingPage from './LandingPage.js';
import Favourite  from './Restaurant/FavouriteRestaurant.js';


class Main extends Component {
    render() {
        return (
            <div>
                <Route exact path="/" component={LandingPage} />
                <Route path="/customerSignup" component={CustomerSignup} />
                <Route path="/restaurantSignup" component={RestaurantSignup} />
                <Route path="/customerLogin" component={CustomerLogin} />
                <Route path="/restaurantLogin" component={RestaurantLogin} />
                <Route path="/customerHome" component={CustomerHome} />
                <Route path="/restaurantHome" component={RestaurantHome} />
                <Route path="/customerProfile" component={CustomerProfile} />
                <Route path="/restaurantProfile" component={RestaurantProfile} />
                <Route path="/custNavBarHome" component={CustomerNavigationBarHome} />
                <Route path="/restoNavBarHome" component={RestoNavigationBarHome} />
                <Route path="/menu" component={Menu} />
                <Route path="/restaurant" component={Restaurant} />
                <Route path="/cart" component={Cart} />
                <Route exact path="/orders" component={CustomerOrders} />
                <Route path="/order/confirm" component={ConfirmOrder} />
                <Route path="/orders/billing" component={OrderBillView} />
                <Route path="/orders/details" component={OrderItemsView} />
                <Route path="/orders/restaurant/orders/details" component={OrderItemsRestaurantView} />
                <Route path="/orders/history" component={OrderHistory} />
                <Route path="/orders/orderHistory" component={RestaurantOrderHistory} />
                <Route path="/favourite" component={Favourite} />

            </div>
        );
    }
}
export default Main;