const Order = require('../Models/OrderModel');
const Cart = require('../Models/CartModel');

const moment= require('moment');

function handle_request(msg, callBack) {
    console.log("Inside order handle request");

    if(msg.path == 'place-order'){
        console.log("Inside place order details handle request");
        const data = msg.data;
        console.log("Data from the request", data);
        const timestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        console.log("TimeStamp while placing the order", timestamp);
        var item_details = [];
        data.cart_items.forEach(cart_item => {
            item_details.push({
                item_id: cart_item.item_id,
                item_quantity: cart_item.item_quantity,
                item_name: cart_item.item_name,
                item_price: cart_item.item_price
            })
        });
        var orderdetails = new Order({
            cust_id: data.user_id,
            cust_name: data.cust_name,
            address: data.address,
            phone_number: data.phone_number,
            resto_id: data.resto_id, 
            resto_name: data.resto_name,
            order_status: data.order_status,
            sub_total: data.sub_total,
            tax: data.tax,
            delivery: data.delivery,
            total_price: data.total_price,
            order_instruction: data.order_instruction,
            item_details: item_details,
            order_time: timestamp
          });
          orderdetails.save(data, (error, result) => {
            if (error) {
                callBack(error);
            }
            data.cart_items.forEach(cart_item => {
                Cart.deleteOne({item_id: cart_item.item_id, cust_id: data.user_id},(error, result) => {
                    if (error) {
                        console.error("Delete cart item", error);
                        callBack(error);
                    }
                    console.log("Deleted items from cart after placing the order", result);
                });
            });
            console.log("Order place details", result);
            return callBack(null, result);
        });
    }

    if(msg.path == 'get-order-by-orderid'){
        console.log("Inside get order by order id handle request", msg.data);
        const data = msg.data;
        Order.findOne({_id: data }, (error, result) => {
            if (error) {
                callBack(error);
            }
            console.log("Get order result:", result);
            return callBack(null, result);
        });     
    }

    if(msg.path == 'get-order-by-restoid'){
        console.log("Inside get order by resto id handle request", msg.data);
        const data = msg.data;
        Order.find({resto_id: data }, (error, result) => {
            if (error) {
                callBack(error);
            }
            console.log("Get order result:", result);
            return callBack(null, result);
        });     
    }

    if(msg.path == 'update-order-status'){
        console.log("Inside update order status handle request", msg.data);
        const data = msg.data;
        var newData = {
            order_status: data.order_status
        }
        Order.updateOne({_id: data.order_id},newData, (error, result) => {
            if (error) {
                callBack(error);
            }
            console.log("update order status result:", result);
            return callBack(null, result);
        });     
    }

    if(msg.path == 'cancel-order'){
        console.log("Inside cancel order handle request");
        const data = msg.data;
        var newData = {
            order_status: 'ORDER_CANCELLED'
        }
        Order.updateOne({_id: data.order_id},newData,(error, result) => {
            if (error) {
                console.error("cancel order error", error);
                callBack(error);
            }
            console.log("Result of cancel order", result);
            return callBack(null, result);
        });     
    }
};
exports.handle_request = handle_request;