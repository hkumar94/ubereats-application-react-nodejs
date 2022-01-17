
const Restaurant = require('../Models/RestaurantModel');

function handle_request(msg, callBack) {
    console.log("Inside restaurant handle request");
    if (msg.path == 'get-restaurant-details') {
        console.log("Inside restaurant handle request : get-restaurant-details");
        const data = msg.data
        console.log("Data from the request", data);
        Restaurant.findOne({ _id: data }, (error, result) => {
            if (error) {
                console.log("Error while fetching restaurant details", error);
                callBack(error);
            }
            console.log("Fetching restaurant details result", result);
            return callBack(null, result);
        })
    }

    if (msg.path == 'update-restaurant-profile') {
        console.log("Inside restaurant handle request : update-restaurant-profile");
        const data = msg.data
        var newData = {
            resto_name: data.resto_name,
            resto_description: data.description,
            password: data.pwd,
            address: data.address,
            zipcode: data.zipcode,
            phone_number: data.phone_number,
            timings: data.timings,
            delivery: data.delivery,
            favourite: data.favourite,
            country: data.country,
            dob: data.dob,
            email_id: data.email_id
        }
        console.log("newData from the request", newData);
        Restaurant.updateOne({ _id: data.user_id }, newData, { upsert: false }, (error, result) => {
            if (error) {
                console.log("Error while updating restaurant details", error);
                callBack(error);
            }
            console.log("Result after updating restaurant details", result);
            return callBack(null, result);
        });
    }

    if (msg.path == 'restaurant-search') {
        console.log("Inside restaurant handle request : restaurant-search");
        const searchinput = msg.data
        console.log("Data from the request", searchinput);

        if(searchinput == "_") {
            console.log("Getting all restaurant details");
            Restaurant.find({}, (error, result) => {
                if (error) {
                    callBack(error);
                }
                console.log("Restaurant search result:",result);
                return callBack(null, result);
            });    

        } else {
            let filter = {};
            filter = {
                '$or' : [ 
                        {resto_name: { "$regex": searchinput, "$options": "i" }},
                        {address: { "$regex": searchinput, "$options": "i" }}
                    ]
            }
            console.log("filter", filter);
            Restaurant.find(filter, (error, result) => {
                if (error) {
                    callBack(error);
                }
                console.log("Restaurant search result:",result);
                return callBack(null, result);
            });
        }
    }
};

exports.handle_request = handle_request;