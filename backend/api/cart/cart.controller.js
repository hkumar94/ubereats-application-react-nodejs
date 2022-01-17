var kafka = require('../../kafka/client');

const {
    addItemToCart,
    getCartItems
} = require("./cart.service");

const jwt = require('jsonwebtoken');
const { secret } = require('../../config/configValue');

console.log('req');
module.exports = {
    addItemToCart: (req, res) => {
        console.log("Add cart item controller", req.body);
        const params = {
            data: req.body,
            path: 'add-cart-item'
        }
        kafka.make_request('cart', params, (error, result) => {
            if (error) {
                console.log(error);
                callBack(error);
            }
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            })
            res.end('ITEM_ADDED_TO_CART');
        });
    },

    deleteItemCart: (req,res) => {
        console.log("Add cart item controller", req.body);
        const params = {
            data: req.body,
            path: 'delete-cart-item'
        }
        kafka.make_request('cart', params, (error, result) => {
            if (error) {
                console.log(error);
                callBack(error);
            }
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            })
            res.end('ITEM_REMOVED');
        });    
    },

    getCartItems: (req,res) => {
        console.log("get cart items controller", req.params.userid);
        const params = {
            data: req.params.userid,
            path: 'get-cart-items'
        }
        kafka.make_request('cart', params, (error, result) => {
            if (error) {
                console.log(error);
                callBack(error);
            }
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            })
            res.end(JSON.stringify(result));
        });    
    }

    
}