const router = require("express").Router();
const passport = require('passport');

console.log('Restaurant Router');
const {
    customerLogin,
} = require("./login.service");

let checkAuth = passport.authenticate('jwt', { session: false });
router.post("/customer/", customerLogin);


const {
    restaurantLogin,
} = require("./login.service");

//let checkAuth = passport.authenticate('jwt', { session: false });
router.post("/restaurant/", restaurantLogin);

module.exports = router;