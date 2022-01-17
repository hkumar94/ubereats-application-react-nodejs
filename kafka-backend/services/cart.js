
const Cart = require('../Models/CartModel');

function handle_request(msg, callBack) {
    console.log("Inside cart handle request");

    if(msg.path == 'add-cart-item'){
        console.log("Inside add item to cart handle request");
        const data = msg.data;
        console.log("Data from the request", data);
        var cartItem = new Cart({
            cust_id: data.user_id,
            resto_id: data.resto_id,
            resto_name: data.resto_name, 
            item_id: data.item_id,
            item_name: data.item_name,
            item_price: data.item_price,
            item_quantity: data.item_quantity
          });
        cartItem.save(data, (error, result) => {
            if (error) {
                callBack(error);
            }
            return callBack(null, result);
        });
    }

    if(msg.path == 'delete-cart-item'){
        console.log("Inside delete cart items handle request");
        const data = msg.data;
        
        Cart.deleteOne({item_id: data.item_id, cust_id: data.user_id},(error, result) => {
            if (error) {
                console.error("Delete cart item", error);
                callBack(error);
            }
            console.log("Result of remove item cart", result);
            return callBack(null, result);
        });     
    }

    if(msg.path == 'get-cart-items'){
        console.log("Inside get cart items handle request", msg.data);
        const data = msg.data;
        Cart.find({cust_id: data }, (error, result) => {
            if (error) {
                callBack(error);
            }
            console.log("Get cart items", result);
            return callBack(null, result);
        });     
    }
};
exports.handle_request = handle_request;