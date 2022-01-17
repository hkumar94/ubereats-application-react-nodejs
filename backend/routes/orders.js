const express = require("express");
const router = express.Router();
const pool = require('../sqlpool.js');

router.get('/pendingorders/:user_id', (req, res) => {
  console.log('hellos');  
  let sql = `SELECT 
  o.order_id, o.resto_id, r.resto_name, r.location, u.cust_name, u.address, u.phone_number, r.zipcode, o.order_status,
  o.sub_total, o.tax, o.delivery, o.discount, o.total_price
  FROM uber_eats.orders o
  JOIN restaurant r
  ON r.resto_id = o.resto_id
  JOIN customer u
  ON u.cust_id = o.user_id
  WHERE o.user_id = '${req.params.user_id}' 
  AND o.order_status NOT IN ("DELIVERED", "ORDER_CANCELLED", "ORDER_DECLINED")`;

  pool.query(sql, (err, result) => {
    if (err) {
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      console.log("Database Error",err);
    }
    if (result && result.length > 0) {
      console.log("hi there");  
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      res.end(JSON.stringify(result));
    }
    else {
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      res.end('NO_PENDING_ORDERS');
    }
  });
});

router.get('/orderitems/:order_id', (req, res) => {
    console.log("inside orderitems", req.params.order_id);
    let sql = `SELECT 
    o.order_id, o.item_id, o.item_quantity, mi.item_name, mi.item_price, mi.item_description
    FROM uber_eats.order_details o
    JOIN menu_items mi
    ON mi.item_id = o.item_id
    WHERE o.order_id = '${req.params.order_id}' `;
    pool.query(sql, (err, result) => {
      if (err) {
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end("Database Error", err);
      }
      if (result && result.length > 0) {
        res.writeHead(200, {
          'Content-Type': 'text/plain'
        });
        res.end(JSON.stringify(result));
      }
      else {
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end("NO_RECORDS");
      }
    });
  });

  router.get('/completedorders/restaurant/:user_id', (req, res) => {
    console.log("inside restaurant order history", req.params.user_id);
    let sql = `SELECT 
    o.order_id, o.resto_id, r.resto_name, r.location, u.cust_name, u.address, u.phone_number, r.zipcode, o.order_status,
    o.sub_total, o.tax, o.delivery, o.discount, o.total_price
    FROM uber_eats.orders o
    JOIN restaurant r
    ON r.resto_id = o.resto_id
    JOIN customer u
    ON u.cust_id = o.user_id
    WHERE o.resto_id = '${req.params.user_id}' `;
    pool.query(sql, (err, result) => {
      if (err) {
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end("Database Error",err);
      }
      if (result && result.length > 0) {
        res.writeHead(200, {
          'Content-Type': 'text/plain'
        });
        res.end(JSON.stringify(result));
      }
      else {
        res.writeHead(200, {
          'Content-Type': 'text/plain'
        });
        res.end("NO_ORDERS");
      }
    });
  });

  router.post('/updateStatus', (req, res) => {
    console.log("Inside update order at restaurant data", req.body.order_id, req.body.order_status);
    
    sql = `UPDATE uber_eats.orders set order_status = '${req.body.order_status}' where order_id = '${req.body.order_id}' `;
       
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
        console.log("Order status updated successfully!");
        res.writeHead(200, {
          'Content-Type': 'text/plain'
        });
        res.end('ORDER_STATUS_UPDATED');
      }
      else if (result && result.length > 0 && result.status === 'NO_RECORD') {
        res.writeHead(401, {
          'Content-Type': 'text/plain'
        });
        res.end(result[0][0].status);
      }
    });
  });

  router.post('/cancelorder', (req, res) => {
    let sql = `UPDATE uber_eats.orders SET order_status = 'ORDER_CANCELLED' WHERE order_id = ${req.body.order_id};`;
    pool.query(sql, (err, result) => {
      if (err) {
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end("Database Error");
      }
      if (result) {
        res.writeHead(200, {
          'Content-Type': 'text/plain'
        });
        console.log("Order cancelled");
        res.end("ORDER_CANCELLED");
      }
    });
  });

module.exports = router;