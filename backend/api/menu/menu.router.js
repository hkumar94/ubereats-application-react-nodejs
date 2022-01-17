const router = require("express").Router();
const passport = require('passport');
const multer = require('multer');

console.log('Menu Router');
const {
    addMenu,
    addMenuSection,
    getMenuSections,
    getMenuItems,
    uploadMenuImage,
    getMenuItem
} = require("./menu.controller");

let checkAuth = passport.authenticate('jwt', { session: false });
router.post("/addMenu", addMenu);
router.post("/addMenuSection", addMenuSection);
router.get("/getMenuSections/:id", getMenuSections);
router.get("/getMenuItems/:id", getMenuItems);
router.post("/uploads/image", multer({ dest: 'temp/', limits: { fieldSize: 8 * 1024 * 1024 } }).single('image'), uploadMenuImage);
router.get("/getMenuItem/:id", getMenuItem);

module.exports = router;