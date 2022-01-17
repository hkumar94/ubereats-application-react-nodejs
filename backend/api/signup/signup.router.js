const router = require("express").Router();
const passport = require('passport');

console.log('Signup Router');
const {
    customersignup,
} = require("./signup.service");

let checkAuth = passport.authenticate('jwt', { session: false });

router.post("/customer/", customersignup);

const {
    restaurantSignup,
} = require("./signup.service");

router.post("/restaurant/", restaurantSignup);

module.exports = router;