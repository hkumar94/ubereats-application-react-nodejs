const router = require("express").Router();
const passport = require('passport');
const multer = require('multer');

// const { checkToken } = require("../../auth/token_validation");
const {
    getCustomerProfileDetails,
    updateCustomerProfile,
    updateCustomerProfilePic

} = require("./customer.controller");

//let checkAuth = passport.authenticate('jwt', { session: false });
// router.get("/", checkToken, getUsers);
 router.get("/getCustomerProfileDetails/:id", getCustomerProfileDetails);
 router.post("/updateCustomerProfilePic", multer({ dest: 'temp/', limits: { fieldSize: 8 * 1024 * 1024 } }).single('image'), updateCustomerProfilePic);
 router.post("/updateCustomerProfile", updateCustomerProfile);

module.exports = router;