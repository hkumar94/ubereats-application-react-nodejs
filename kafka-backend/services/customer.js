
const Customer = require('../Models/CustomerModel');

function handle_request(msg, callBack) {
    console.log("Inside customer kafka handle request");
    if (msg.path == 'get-customer-details') {
        console.log("Inside customer handle request : get-customer-details");
        const data = msg.data
        console.log("Data from the request", data);
        Customer.findOne({ _id: data }, (error, result) => {
            if (error) {
                console.log("Error while fetching customer details", error);
                callBack(error);
            }
            console.log("Fetching customer details result", result);
            return callBack(null, result);
        })
    }

    if(msg.path == 'update-customer-details'){
        console.log("Inside update customer details kafka handle request");
        const data = msg.data;
        console.log("Data from the request", data);
        Customer.updateOne({ _id: data.user_id }, data, { upsert: false }, (error, result) => {
            if (error) {
                callBack(error);
            }
            return callBack(null, result);
        })
    }

};

exports.handle_request = handle_request;