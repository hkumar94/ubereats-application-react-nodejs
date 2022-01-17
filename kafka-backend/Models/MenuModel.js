const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var menuItemSchema = new Schema({
    _id: {type: Schema.ObjectId, auto: true },
    item_name: {type: String, required: true},
    item_description: {type: String, required: true},
    item_price: {type: Number},
    item_image: {type: String},
    item_category: {type: String},
    resto_id: {type: String}
},
{
    versionKey: false
});

const menumodel = mongoose.model('menu_item', menuItemSchema);
module.exports = menumodel;