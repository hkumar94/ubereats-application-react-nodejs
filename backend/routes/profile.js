const express = require("express");
const router = express.Router();
const passwordHash = require('password-hash');
const pool = require('../sqlpool.js');

router.get('/customer/:user_id', (req, res) => {
    console.log("Backend -> Get Profile");
    let sql = "SELECT * FROM uber_eats.customer WHERE cust_id = ?";
   
    pool.query(sql, req.params.user_id, (err, result) => {
      if (err) {
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end("Error in Data");
      }
      if (result && result.length > 0) {
        console.log("User data fetched successfully");
        res.cookie('cookie', "admin", { maxAge: 90000000, httpOnly: false, path: '/' });
        req.session.user = req.body.email_id;
        let userObject = { user_id: result[0].cust_id, name: result[0].cust_name, email_id: result[0].email_id, pwd: result[0].pwd, address: result[0].address, phone_number: result[0].phone_number, user_image: result[0].cust_img};
        res.writeHead(200, {
          'Content-Type': 'text/plain'
        })
        console.log(JSON.stringify(userObject));
        res.end(JSON.stringify(userObject));
      } else {
        
        res.writeHead(401, {
            'Content-Type': 'text/plain'
        })
        res.end("USER_PROFILE_NOT_FOUND");
          
      }
    });
  });

  router.get('/restaurant/:user_id', (req, res) => {
    console.log("Backend -> Get Restaurant Profile");
    let sql = "SELECT * FROM uber_eats.restaurant WHERE resto_id = ?";
   
    pool.query(sql, req.params.user_id, (err, result) => {
      if (err) {
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end("Error in Data");
      }
      if (result && result.length > 0) {
        console.log("Restaurant data fetched successfully");
        res.cookie('cookie', "admin", { maxAge: 90000000, httpOnly: false, path: '/' });
        req.session.user = req.body.email_id;
        let userObject = { user_id: result[0].resto_id, name: result[0].resto_name, description: result[0].resto_description, email_id: result[0].email_id, pwd: result[0].pwd, address: result[0].location, phone_number: result[0].phone_number,
        timings: result[0].timings, res_image: result[0].res_image, zipcode: result[0].zipcode, delivery: result[0].delivery};
        res.writeHead(200, {
          'Content-Type': 'text/plain'
        })
        console.log(JSON.stringify(userObject));
        res.end(JSON.stringify(userObject));
      } else {
        
        res.writeHead(401, {
            'Content-Type': 'text/plain'
        })
        res.end("RESTAURANT_PROFILE_NOT_FOUND");
          
      }
    });
  });


  router.post('/customer', (req, res) => {
    console.log("Inside update customer data");
    let sql;
    if(req.body.password && req.body.password !== "")
    {
      var hashedPassword = "'" + passwordHash.generate(req.body.password) + "'";
      sql = `UPDATE uber_eats.customer set cust_name = '${req.body.name}', pwd = ${hashedPassword}, address = '${req.body.address}', phone_number = '${req.body.phone_number}',
      country = '${req.body.country}', dob = '${req.body.dob}' where email_id = '${req.body.email_id}' `;
    }
    else{
      sql = `UPDATE uber_eats.customer set cust_name = '${req.body.name}', address = '${req.body.address}', phone_number = '${req.body.phone_number}',
      country = '${req.body.country}', dob = '${req.body.dob}' where email_id = '${req.body.email_id}' `;
    }
    
    pool.query(sql, (err, result) => {
      console.log(result);
      if (err) {
        console.log(err);
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end("Error in Data");
      }
      if (result) {
        console.log("Customer data updated successfully!");
        res.writeHead(200, {
          'Content-Type': 'text/plain'
        });
        res.end('CUSTOMER_UPDATED');
      }
      else if (result && result.length > 0 && result.status === 'NO_RECORD') {
        res.writeHead(401, {
          'Content-Type': 'text/plain'
        });
        res.end('NO_RECORD');
      }
    });
  });


  router.post('/restaurant', (req, res) => {
    console.log("Inside update restaurant data", req.body.delivery, req.body.pickup);
    let sql;
    if(req.body.password && req.body.password !== "")
    {
      var hashedPassword = "'" + passwordHash.generate(req.body.password) + "'";
      sql = `UPDATE uber_eats.restaurant set resto_name = '${req.body.name}', pwd = ${hashedPassword}, location = '${req.body.address}', phone_number = '${req.body.phone_number}', resto_description = '${req.body.description}', timings = '${req.body.timings}' ,
      zipcode = '${req.body.zipcode}', delivery = '${req.body.delivery}', pickup = '${req.body.pickup}'  where resto_id = '${req.body.user_id}' `;
    }
    else{
      sql = `UPDATE uber_eats.restaurant set resto_name = '${req.body.name}', location = '${req.body.address}', phone_number = '${req.body.phone_number}', resto_description = '${req.body.description}', timings = '${req.body.timings}' ,
      zipcode = '${req.body.zipcode}', delivery = '${req.body.delivery}', pickup = '${req.body.pickup}' where resto_id = '${req.body.user_id}' `;
    }
    
    pool.query(sql, (err, result) => {
      console.log(result);
      if (err) {
        console.log(err);
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end("Error in Data");
      }
      if (result) {
        console.log("Restaurant data updated successfully!");
        res.writeHead(200, {
          'Content-Type': 'text/plain'
        });
        res.end('RESTAURANT_UPDATED');
      }
      else if (result && result.length > 0 && result.status === 'NO_RECORD') {
        res.writeHead(401, {
          'Content-Type': 'text/plain'
        });
        res.end(result[0][0].status);
      }
    });
  });

module.exports = router;