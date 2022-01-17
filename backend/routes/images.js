const express = require("express");
const router = express.Router();
const pool = require('../sqlpool.js');
const path = require('path');
const fs = require('fs');

router.get('/user/:user_image', (req, res) => {
    console.log("User Image", req.params.user_image);
    var image = path.join(__dirname, '..') + '/public/uploads/users/' + req.params.user_image;
    if (fs.existsSync(image)) {
        res.sendFile(image);
    }
    else {
        res.sendFile(path.join(__dirname, '..') + '/public/uploads/users/userplaceholder.jpg')
    }
});

router.get('/restaurant/:res_image', (req, res) => {
    var image = path.join(__dirname, '..') + '/public/uploads/restaurants/' + req.params.res_image;
    if (fs.existsSync(image)) {
        res.sendFile(image);
    }
    else {
        res.sendFile(path.join(__dirname, '..') + '/public/uploads/restaurants/resplaceholder.jpg')
    }
});

router.get('/item/:item_image', (req, res) => {
    console.log("getting image from folder", req.params.item_image);
    var image = path.join(__dirname, '..') + '/public/uploads/items/' + req.params.item_image;
    if (fs.existsSync(image)) {
        res.sendFile(image);
    }
    else {
        res.sendFile(path.join(__dirname, '..') + '/public/uploads/items/itemplaceholder.jpg')
    }
});



module.exports = router;