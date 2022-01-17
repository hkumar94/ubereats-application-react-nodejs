var kafka = require('../../kafka/client');
const OrderModel = require("../../Models/OrderModel");

const jwt = require('jsonwebtoken');
const { secret } = require('../../config/configValue');

console.log('req');
module.exports = {
    placeorder: (req, res) => {
        console.log("Place order controller", req.body);
        const params = {
            data: req.body,
            path: 'place-order'
        }
        kafka.make_request('order', params, (error, result) => {
            if (error) {
                console.log(error);
                callBack(error);
            }
            console.log("Order placed details", result);
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            })
            res.end('ORDER_PLACED');
        });
    },
    pendingorders: (req,res) => {
        console.log("Inside get pendingorders", req.params.user_id);

        OrderModel.find({cust_id: req.params.user_id}, (error, result) => {
            console.log("Get pending order result", result);
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            })
            res.end(JSON.stringify(result));
        });

    },
    getOrderByOrderStatus: (req,res) => {
        console.log("Inside get order by order status", req.body.cust_id);
        console.log("order status", req.body.order_status);
        let filter = {};
        filter = {
            '$and': [
                { cust_id: { "$regex": req.body.cust_id, "$options": "i" } },
                { order_status: { "$regex": req.body.order_status, "$options": "i" } }
            ]
        }
        OrderModel.find(filter, (error, result) => {
            console.log("Get order by order status result", result);
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            })
            res.end(JSON.stringify(result));
        });

    },
    getOrderByOrderId: (req, res) => {
        console.log("Inside Get order by order id controller", req.params.id);
        const params = {
            data: req.params.id,
            path: 'get-order-by-orderid'
        }
        kafka.make_request('order', params, (error, result) => {
            if (error) {
                console.log(error);
                callBack(error);
            }
            console.log("Get order details:", result);
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            })
            res.end(JSON.stringify(result));
        });
    },
    getOrderByRestId: (req, res) => {
        console.log("Inside Get order by resto id controller", req.params.id);
        const params = {
            data: req.params.id,
            path: 'get-order-by-restoid'
        }
        kafka.make_request('order', params, (error, result) => {
            if (error) {
                console.log(error);
                callBack(error);
            }
            console.log("Get order details:", result);
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            })
            res.end(JSON.stringify(result));
        });
    },
    updateOrderStatus: (req, res) => {
        console.log("Inside update order status controller", req.body);
        const params = {
            data: req.body,
            path: 'update-order-status'
        }
        kafka.make_request('order', params, (error, result) => {
            if (error) {
                console.log(error);
                callBack(error);
            }
            console.log("update order status details:", result);
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            })
            res.end('ORDER_STATUS_UPDATED');
        });
    },
    cancelOrder: (req, res) => {
        console.log("Cancel order controller", req.body);
        const params = {
            data: req.body,
            path: 'cancel-order'
        }
        kafka.make_request('order', params, (error, result) => {
            if (error) {
                console.log(error);
                callBack(error);
            }
            console.log("Order caancel details", result);
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            })
            res.end('ORDER_CANCELLED');
        });
    },

}