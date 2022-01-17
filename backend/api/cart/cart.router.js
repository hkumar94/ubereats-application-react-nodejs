const router = require("express").Router();
const passport = require('passport');

console.log('Cart Router');
const {
    addItemToCart,
    deleteItemCart,
    getCartItems
} = require("./cart.controller");

let checkAuth = passport.authenticate('jwt', { session: false });
router.post("/addItem", addItemToCart);
router.post("/cartItemDelete", deleteItemCart);
router.get("/getcartitems/:userid", getCartItems);

module.exports = router;