const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var menuSectionSchema = new Schema({
    _id: {type: Schema.ObjectId, auto: true },
    menu_section_name: {type: String, required: true},
    resto_id: {type: String}
},
{
    versionKey: false
});

const menusectionmodel = mongoose.model('menu_section', menuSectionSchema);
module.exports = menusectionmodel;