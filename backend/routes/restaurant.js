const express = require("express");
const router = express.Router();
const passwordHash = require('password-hash');
const pool = require('../sqlpool.js');

router.get('/restaurantsearch/:search_input', (req, res) => {
    console.log("Inside restaurant search call of DB");
    let search_input = req.params.search_input;
    let search_string = "%".concat(search_input,"%");
  
    
    let sql = `SELECT DISTINCT 
    r.resto_id, r.resto_name, r.resto_description, r.res_cuisine, r.res_image, r.location, r.phone_number, r.email_id, r.zipcode, r.timings
    FROM uber_eats.restaurant r
    LEFT OUTER JOIN menu_items mi
    ON mi.resto_id = r.resto_id
    LEFT OUTER JOIN menu_sections ms
    ON ms.resto_id = r.resto_id
    WHERE (mi.item_name LIKE '${search_string}')
    OR mi.item_description LIKE '${search_string}'
    OR r.resto_name LIKE '${search_string}'
    OR r.res_cuisine LIKE '${search_string}'
    OR ms.menu_section_name LIKE '${search_string}' `;

    pool.query(sql, (err, result) => {
      if (err) {
        console.log("error", err);  
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end("Error in Data");
      }
      if (result && result.length > 0) {
        res.writeHead(200, {
          'Content-Type': 'text/plain'
        });
        console.log("Restaurant search result from DB", result);
        res.end(JSON.stringify(result));
      } else {
          res.end('NO_RECORD');
      }
    });
  });


  router.post('/restaurantDeliverySearch', (req, res) => {
    let search_input = req.body.searchInput;
    let search_string = "%".concat(search_input,"%");
    let deliverySearch = req.body.delivery;
    let pickupSearch = req.body.pickup;
    let categorySearch = req.body.category;
    console.log("Helossss", categorySearch);
    
    console.log("delivery", deliverySearch);
    console.log("pickup", pickupSearch);

    let sql ;

    if (deliverySearch && deliverySearch === true && pickupSearch === false) {
      sql = `SELECT DISTINCT 
      r.resto_id, r.resto_name, r.resto_description, r.res_cuisine, r.res_image, r.location, r.phone_number, r.email_id, r.zipcode, r.timings
      FROM uber_eats.restaurant r
      LEFT OUTER JOIN menu_items mi
      ON mi.resto_id = r.resto_id
      LEFT OUTER JOIN menu_sections ms
      ON ms.resto_id = r.resto_id
      WHERE ((mi.item_name LIKE '${search_string}')
      OR mi.item_description LIKE '${search_string}'
      OR r.resto_name LIKE '${search_string}'
      OR r.location LIKE '${search_string}'
      OR ms.menu_section_name = '${categorySearch}')
      AND r.delivery = '${true}' `;
    } 
    else if(pickupSearch && pickupSearch === true && deliverySearch === false) {
      sql = `SELECT DISTINCT 
      r.resto_id, r.resto_name, r.resto_description, r.res_cuisine, r.res_image, r.location, r.phone_number, r.email_id, r.zipcode, r.timings
      FROM uber_eats.restaurant r
      LEFT OUTER JOIN menu_items mi
      ON mi.resto_id = r.resto_id
      LEFT OUTER JOIN menu_sections ms
      ON ms.resto_id = r.resto_id
      WHERE ((mi.item_name LIKE '${search_string}')
      OR mi.item_description LIKE '${search_string}'
      OR r.resto_name LIKE '${search_string}'
      OR r.location LIKE '${search_string}'
      OR ms.menu_section_name = '${categorySearch}')
      AND r.pickup = '${true}' `;
    }
    else if(pickupSearch && pickupSearch === true && deliverySearch && deliverySearch === true) {
      sql = `SELECT DISTINCT 
      r.resto_id, r.resto_name, r.resto_description, r.res_cuisine, r.res_image, r.location, r.phone_number, r.email_id, r.zipcode, r.timings
      FROM uber_eats.restaurant r
      LEFT OUTER JOIN menu_items mi
      ON mi.resto_id = r.resto_id
      LEFT OUTER JOIN menu_sections ms
      ON ms.resto_id = r.resto_id
      WHERE ((mi.item_name LIKE '${search_string}')
      OR mi.item_description LIKE '${search_string}'
      OR r.resto_name LIKE '${search_string}'
      OR r.location LIKE '${search_string}'
      OR ms.menu_section_name = '${categorySearch}')
      AND r.pickup = '${true}'
      AND r.delivery = '${true}' `;
    }
    else {
      console.log("HMMMMMM");
      sql = `SELECT DISTINCT 
      r.resto_id, r.resto_name, r.resto_description, r.res_cuisine, r.res_image, r.location, r.phone_number, r.email_id, r.zipcode, r.timings
      FROM uber_eats.restaurant r
      LEFT OUTER JOIN menu_items mi
      ON mi.resto_id = r.resto_id
      LEFT OUTER JOIN menu_sections ms
      ON ms.resto_id = r.resto_id
      WHERE (mi.item_name LIKE '${search_string}'
      OR mi.item_description LIKE '${search_string}'
      OR r.resto_name LIKE '${search_string}'
      OR r.location LIKE '${search_string}')
      AND ms.menu_section_name = '${categorySearch}' `; 
    }

    pool.query(sql, (err, result) => {
      if (err) {
        console.log("error", err);  
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end("Error in Data");
      }
      if (result && result.length > 0) {
        res.writeHead(200, {
          'Content-Type': 'text/plain'
        });
        console.log("Restaurant search result from DB", result);
        res.end(JSON.stringify(result));
      } else {
          res.end('NO_RECORD');
      }
    });
  });

  router.get('/:res_id', (req, res) => {

    let sql = "SELECT * FROM uber_eats.restaurant WHERE resto_id = ?";
    pool.query(sql, req.params.res_id, (err, result) => {
      if (err) {
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end("Database Error", err);
      }
      if (result && result.length > 0 ) {
        let restoObject = { user_id: result[0].resto_id, name: result[0].resto_name, description: result[0].resto_description, email_id: result[0].email_id, pwd: result[0].pwd, address: result[0].location, phone_number: result[0].phone_number,
          timings: result[0].timings, res_image: result[0].res_image, zipcode: result[0].zipcode, delivery: result[0].delivery};
  
        res.writeHead(200, {
          'Content-Type': 'text/plain'
        });
        console.log(restoObject);
        res.end(JSON.stringify(restoObject));
      }
    });
  });

  router.post('/updateFavStatus', (req, res) => {
    console.log("Inside update restaurant as favourite", req.body.resto_id, req.body.user_id);
    let sql = `insert into uber_eats.favourite_restaurant(resto_id, cust_id)values('${req.body.resto_id}', '${req.body.user_id}')`;
    pool.query(sql, (err, result) => {
      if (err) {
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end("Database Error", err);
      }
      if (result && result.affectedRows > 0) {
        res.writeHead(200, {
          'Content-Type': 'text/plain'
        });
        
        res.end('UPDATED_FAV_RESTAURANT');
      }
    });
  });

  router.get('/updateFavStatus/:user_id', (req, res) => {
    console.log("Inside get favourite restaurant for user: ", req.params.user_id);
    let sql = `SELECT resto_id FROM uber_eats.favourite_restaurant WHERE cust_id = '${req.params.user_id}' `;
    pool.query(sql, (err, result) => {
      if (err) {
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end("Database Error", err);
      }
      if (result && result.length > 0) {
        console.log("result resto:", result[0].resto_id);
        result.forEach(resto => {
        let rsql = `SELECT * FROM uber_eats.restaurant WHERE resto_id = '${resto.resto_id}' `;
        pool.query(rsql, (err, reslt) => {
            if (err) {
              res.writeHead(500, {
                'Content-Type': 'text/plain'
              });
              res.end("Database Error", err);
            }
            if (reslt && reslt.length > 0 ) {
              console.log("Resulttttttttt",reslt);      
              res.writeHead(200, {
                'Content-Type': 'text/plain'
              });
              
              res.end(JSON.stringify(reslt));
            }
            else {
              res.writeHead(500, {
                'Content-Type': 'text/plain'
              });
              res.end('DATABASE ERROR');  
            }
          });   
        });  
        console.log("Get favourite restaurant result", result); 
      }
      else {
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end('NO_FAVOURITE_RESTAURANT');
      }
    });
  });

  router.get('/getFavRestaurant', (req, res) => {
    console.log("Inside get favourite restaurant");
    var fav = 'F';
    let sql = `SELECT * FROM uber_eats.restaurant WHERE favourite = '${fav}' `;
    pool.query(sql,(err, result) => {
      if (err) {
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end("Database Error", err);
      }
      if (result && result.length > 0 ) {
        console.log("Your favourite restaurant", result);
  
        res.writeHead(200, {
          'Content-Type': 'text/plain'
        });
        res.end(JSON.stringify(result));
      }
      else {
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end('INTERNAL SERVER ERROR');
      }
    });
  });


  module.exports = router;

