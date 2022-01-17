const express = require("express");
const router = express.Router();
const pool = require('../sqlpool.js');
const moment= require('moment');

router.post('/item', (req, res) => {
    console.log("Inside add item to cart db call");
    let sql = "INSERT INTO uber_eats.cart (user_id, item_id, resto_id, item_quantity) VALUES (?,?,?,?)";
    pool.query(sql, [req.body.user_id, req.body.item_id, req.body.resto_id, req.body.item_quantity], (err, result) => {
      if (err) {
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        console.log("err", err);
        res.end("Database Error",err);
      }
      if (result && result.affectedRows > 0 ) {
        res.writeHead(200, {
          'Content-Type': 'text/plain'
        });
        res.end('ITEM_ADDED_TO_CART');
      }
    });
  });

  router.get('/item/:user_id', (req, res) => {
    console.log("Inside add item to cart db call");
    let sql = "select m.item_id, c.item_quantity, m.item_price, m.item_name, m.item_description, m.resto_id, c.user_id " 
    + " from uber_eats.cart c" 
    + " left outer join uber_eats.menu_items m on m.item_id = c.item_id "
    + " where c.user_id = ?";
    pool.query(sql, req.params.user_id, (err, result) => {
      if (err) {
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        console.log("error",err);
        res.end("Database Error",err);
      }
      if (result && result.length > 0 ) {
        console.log("Data Successfully inserted:", result);
        res.writeHead(200, {
          'Content-Type': 'text/plain'
        });
        res.end(JSON.stringify(result));
      }
    });
  });

  router.post('/cartItemdelete', (req, res) => {
    let sql = "DELETE from uber_eats.cart where item_id = ? and user_id = ?";
    pool.query(sql, [req.body.item_id,req.body.user_id], (err, result) => {
      console.log("Result after deleteing item", result);
      if (err) {
        console.log(err);
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end("Database Error",err);
      }
      if (result && result.affectedRows > 0) {
        console.log("Item deleted successfully.");
        res.writeHead(200, {
          'Content-Type': 'text/plain'
        });
        res.end('ITEM_REMOVED');
      }
      else if (result && result.length > 0 && result[0][0].status === 'NO_RECORD') {
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end('NO_RECORD');
      }
    });
  });

  router.post('/placeorder', (req, res) => {
    //const timestamp = new Date().getTime();
    const timestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    let sql = `insert into uber_eats.orders(user_id, resto_id, order_status, sub_total, tax, delivery, discount, total_price, order_date, order_instruction) 
    values(${req.body.user_id}, ${req.body.res_id}, '${req.body.order_status}',${req.body.sub_total}, ${req.body.tax}, 
     ${req.body.delivery}, ${req.body.discount}, ${req.body.total}, '${timestamp}', '${req.body.order_instruction}')`;
    pool.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end("Database Error", err);
      }
      if (result && result.affectedRows > 0) {
        let sqlorder = `select order_id from uber_eats.orders where resto_id = '${req.body.res_id}' and user_id = '${req.body.user_id}' 
        and order_status= '${req.body.order_status}' and order_date = '${timestamp}'`;
        pool.query(sqlorder, (err, resd) => {
          if (err) {
            console.log(err);
            res.writeHead(500, {
              'Content-Type': 'text/plain'
            });
            res.end("Database Error");
          }
          if(resd && resd.length > 0) {
            console.log("result", resd[0].order_id);
            req.body.cart_items.forEach(cart_item => {
            let sqlItem = `insert into uber_eats.order_details(order_id,item_id,item_quantity)
            values(${resd[0].order_id},${cart_item.item_id}, ${cart_item.item_quantity})`;
            pool.query(sqlItem, (err, result) => {
              if (err) {
                console.log(err);
                res.writeHead(500, {
                  'Content-Type': 'text/plain'
                });
                res.end("Database Error");
              }
            });
             });  
          }
        });
        
        //order details
        res.writeHead(200, {
          'Content-Type': 'text/plain'
        });
        res.end('ORDER_PLACED');
      }
      else {
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end('ORDER_NOT_PLACED');
      }
    });
  });

  module.exports = router;