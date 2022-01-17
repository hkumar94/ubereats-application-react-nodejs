const {

    getRestaurantProfileDetails,
    updateRestaurantProfile,
    updateRestaurantProfilePic,
    restaurantSearch,
    restaurantDeliverySearch
 } = require("./restaurant.service");
  
  //const jwt = require('jsonwebtoken');
  //const { secret } = require('../../config/configValues');
  //var kafka = require('../../kafka/client');
  
  const { hashSync, genSaltSync, compareSync } = require("bcrypt");
  //const { sign } = require("jsonwebtoken");
  

  
  
  module.exports = {
      
    getRestaurantProfileDetails: (req, res) => {
      const id = req.params.id;
      const data = {
        id: id,
        path: 'get_student_details'
      }
      // kafka.make_request('student',data,(err, results) => {
      //     if (err) {
      //       console.log(err);
      //       return;
      //     }
      //       return res.json({
      //       success: 1,
      //       data: results
      //       });
      //   });
      getRestaurantProfileDetails(id, (err, results) => {
        if (err) {
          console.log(err);
          return;
        }
        return res.json({
          success: 1,
          data: results
        });
      });
    },
  
  
    updateRestaurantProfile: (req, res) => {
      console.log("Update restaurant form data", req);
      updateRestaurantProfile(req, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success: 0,
            message: "Database connection errror"
          });
        }
        return res.status(200).json({
          success: 1,
          data: results
        });
      });
    },
  
  
    updateRestaurantProfilePic: (req, res) => {
      console.log("Inside updateRestaurantProfilePic controller", req.body.id);
      updateRestaurantProfilePic(req, (err, results) => {
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
    

    restaurantSearch: (req, res) => {
      console.log("Inside restaurant search call controller");

      let search_input = req.params.search_input;
      restaurantSearch(search_input, (err, results) => {
        if (err) {
          console.log(err);
          return;
        }
        
        res.end(JSON.stringify(results));
      });
    },

    restaurantDeliverySearch: (req, res) => {
      console.log("Inside restaurant delivery search call controller", req);

      let search_input = req.body.searchInput;
      restaurantDeliverySearch(req, (err, results) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log("in controller result", JSON.stringify(results));
        res.end(JSON.stringify(results));
      });
    }, 
}