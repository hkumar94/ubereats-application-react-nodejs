
const MenuSection = require('../Models/MenuSectionModel');

function handle_request(msg, callBack) {
    console.log("Inside menu section handle request");

    if(msg.path == 'add-menusection-details'){
        console.log("Inside add menu section details handle request");
        const data = msg.data;
        var menuSectiondetails = new MenuSection({
            menu_section_name: data.menu_section_name,
            resto_id: data.resto_id
        });
        menuSectiondetails.save(data, (error, result) => {
            if (error) {
                callBack(error);
            }
            return callBack(null, result);
        });
    }

    if(msg.path == 'get-menusection-items'){
        console.log("Inside get menu section handle request");
        const data = msg.data;
        MenuSection.find({}, (error, result) => {
            if (error) {
                callBack(error);
            }
            return callBack(null, result);
        });  
    }

};

exports.handle_request = handle_request;