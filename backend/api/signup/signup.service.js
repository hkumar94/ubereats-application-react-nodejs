const Customer = require("../../Models/CustomerModel");
const Restaurant = require("../../Models/RestaurantModel");

module.exports = {
  customersignup: (req, res) => {

      console.log('Inside customer signup -> req body:',req.body);
  
      var query = {};
      query.email_id = req.body.email_id;
  
    
      Customer.findOne(query, (error, result) => {
        if (error) {
          console.log(error);
          //callBack(error);
        }else if (result && result != null){
          console.log("User exists", result);
          res.writeHead(401, {
            'Content-Type': 'text/plain'
          })
          res.end('USER_EXISTS');
        }else {
          var customerdetails = new Customer({
            cust_name: req.body.name,
            email_id: req.body.email_id, 
            password: req.body.password,
            dob: req.body.dob,
            country: req.body.country
          });
      
          customerdetails.save((error, data) => {
            if (error) {
              console.log('error', error);
              res.writeHead(500, {
                'Content-Type': 'text/plain'
              })
              res.end('Error in added customer');
            }
            else {
              console.log('data', data);
              res.writeHead(200, {
                'Content-Type': 'text/plain'
              })
              res.end('USER_ADDED');
            }
          });
        }
      });
    },


    restaurantSignup: (req, res) => {

      console.log('Inside restaurant signup -> req body:',req.body);
  
      var query = {};
      query.email_id = req.body.email_id;
  
    
      Restaurant.findOne(query, (error, result) => {
        if (error) {
          console.log(error);
        }else if (result && result != null){
          res.writeHead(401, {
            'Content-Type': 'text/plain'
          })
          console.log('invalid');
          res.end('USER_EXISTS');
        }else {
          var restaurantdetails = new Restaurant({
            resto_name: req.body.name,
            email_id: req.body.email_id, 
            password: req.body.password,
            address: req.body.location
          });
      
          restaurantdetails.save((error, data) => {
            if (error) {
              console.log('error', error);
              res.writeHead(500, {
                'Content-Type': 'text/plain'
              })
              res.end('Error in added customer');
            }
            else {
              console.log('data', data);
              res.writeHead(200, {
                'Content-Type': 'text/plain'
              })
              res.end('USER_ADDED');
            }
          });
        }
      });
    }
}
  