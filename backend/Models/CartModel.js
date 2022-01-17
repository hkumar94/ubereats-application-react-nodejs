const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var cartSchema = new Schema({
    _id: {type: Schema.ObjectId, auto: true },
    cust_id: {type: String },
    item_id: {type: String},
    resto_id: {type: String},
    item_quantity: {type: String}
},
{
    versionKey: false
});

const cartmodel = mongoose.model('cart', cartSchema);
module.exports = cartmodel;