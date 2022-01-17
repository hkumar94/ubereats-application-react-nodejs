const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var orderSchema = new Schema({
    _id: {type: Schema.ObjectId, auto: true },
    cust_id: {type: String },
    address: {type: String },
    resto_id: {type: String},
    resto_name: {type: String},
    order_status: [{type: String}],
    sub_total: {type: Number},
    tax: {type: Number},
    delivery: {type: Number},
    total_price: {type: Number},
    order_date: {type: Date},
    item_details: [
        {
            item_id: {type: String},
            item_name: {type: String},
            item_quantity: {type: String},
            item_name: {type: String}
        }
    ]
},
{
    versionKey: false
});

const ordermodel = mongoose.model('order', orderSchema);
module.exports = ordermodel;