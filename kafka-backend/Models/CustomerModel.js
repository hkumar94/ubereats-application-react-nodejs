const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var customerSchema = new Schema({
    _id: {type: Schema.ObjectId, auto: true },
    cust_name: {type: String, required: true},
    email_id: {type: String, required: true},
    password: {type: String, required: true},
    address: {type: String},
    phone_number: {type: String},
    country: {type: String},
    cust_img: {type: String},
    dob: {type:Date},
    cart: [{
        _id : {type : Schema.ObjectId,auto:true},
        item_name: {type: String},
        item_description: {type: String},
        item_price: {type: Number},
        restaurant_name: {type: String},
        item_quantity: {type: Number}
    }],
    orders:[{
        _id : {type : Schema.ObjectId,auto:true},
        order_id: {type: String},
        order_status: {type: String},
        order_date: {type: Date},
        order_instruction: {type: String},
        resto_name: {type: String},
        item_name: {type: String},
        item_price: {type: Number},
        item_quantity: {type: String}
    }]
},
{
    versionKey: false
});

const customermodel = mongoose.model('customer', customerSchema);
module.exports = customermodel;