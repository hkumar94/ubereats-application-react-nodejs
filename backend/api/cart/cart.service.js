var kafka = require('../../kafka/client');
//Imported for jwt 
const jwt = require('jsonwebtoken');
const { secret } = require("../../config/configValue");
const { auth } = require("../../config/passport");
const { checkAuth } = require("../../config/passport");
auth();

module.exports = {

    addItemToCart: (req, res) => {

        const params = {
            data: req,
            path: 'add-item-cart'
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
        
    }
}
