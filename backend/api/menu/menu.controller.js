const MenuSection = require("../../Models/MenuSectionModel");
const Menu = require("../../Models/MenuModel");
var kafka = require('../../kafka/client');


const {
    addMenu,
    uploadMenuImage
} = require("./menu.service");

//const jwt = require('jsonwebtoken');
//const { secret } = require('../../config/configValues');

console.log('req');
module.exports = {
    addMenu: (req, res) => {
        // var menudetails = new Menu({
        //     item_name: req.body.item_name,
        //     item_description: req.body.item_description, 
        //     item_price: req.body.item_price,
        //     item_category: req.body.item_category,
        //     resto_id: req.body.resto_id,
        //     item_image: req.body.item_image
        //   });
        // menudetails.save((error , results) => {
        //     if (error) {
        //         return res.status(500).json({
        //         success: 0,
        //         data: "Error while adding menu details"
        //         });
        //     }
        //     res.writeHead(200, {
        //         'Content-Type': 'text/plain'
        //         })
        //         res.end('MENU_ADDED');
        // });

        
        const params = {
            data: req.body,
            path: 'add-menu-details'
        }

        kafka.make_request('menu', params, (error, result) => {
            if (error) {
                console.log(error);
                callBack(error);
            }
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            })
            res.end(JSON.stringify(result));
        });
        
    },
    addMenuSection: (req, res) => {
        // var menuSectiondetails = new MenuSection({
        //     menu_section_name: req.body.menu_section_name,
        //     resto_id: req.body.resto_id
        // });

        // menuSectiondetails.save((error , results) => {
        //     if (error) {
        //       return res.status(500).json({
        //         success: 0,
        //         data: "Error while adding menu section details"
        //       });
        //     }
        //     res.writeHead(200, {
        //         'Content-Type': 'text/plain'
        //       })
        //       res.end('MENU_SECTION_ADDED');
        //   });
        const params = {
            data: req.body,
            path: 'add-menusection-details'
        }

        kafka.make_request('menusection', params, (error, result) => {
            if (error) {
                console.log(error);
                callBack(error);
            }
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            })
            res.end('MENU_SECTION_ADDED');
        });
    },
    getMenuSections: (req, res) => {
        console.log("Getting menu sections");
        // MenuSection.find({resto_id: req.params.id }, (error, result) => {
        //         if (error) {
        //             callBack(error);
        //         }
        //         console.log("Get all menu section details:",result);
        //         res.end(JSON.stringify(result));
        //         //return callBack(null, result);
        //     });
            
        const params = {
            data: req.params.id,
            path: 'get-menusection-items'
        }

        kafka.make_request('menusection', params, (error, result) => {
            if (error) {
                console.log(error);
                callBack(error);
            }
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            })
            console.log("Get all menusections:",result);
            res.end(JSON.stringify(result));
        });
    },
    getMenuItems: (req, res) => {
        console.log("Getting menu items");
        // Menu.find({resto_id: req.params.id }, (error, result) => {
        //     if (error) {
        //         callBack(error);
        //     }
        //     console.log("Get all menu items:",result);
        //     res.end(JSON.stringify(result));
        //     //return callBack(null, result);
        // }); 

        const params = {
            data: req.params.id,
            path: 'get-menu-items'
        }

        kafka.make_request('menu', params, (error, result) => {
            if (error) {
                console.log(error);
                callBack(error);
            }
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            })
            console.log("Get all menu items:",result);
            res.end(JSON.stringify(result));
        });
    },
    getMenuItem: (req, res) => {
        console.log("Getting menu item by item id");
        Menu.find({_id: req.params.id }, (error, result) => {
            if (error) {
                callBack(error);
            }
            console.log("Get menu item:",result);
            res.end(JSON.stringify(result));
            //return callBack(null, result);
        }); 
    },
    
      uploadMenuImage: (req, res) => {
        console.log("Inside uploadMenuImage controller", req.body.id);
        uploadMenuImage(req, (err, results) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              success: 0,
              message: "Database connection errror"
            });
          }
          console.log("upload profile pic", results);
          res.end(JSON.stringify(results));
        });
      },
}