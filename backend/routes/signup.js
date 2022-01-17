const express = require("express");
const router = express.Router();
const passwordHash = require('password-hash');
const pool = require('../sqlpool.js');

router.post('/customer', (req, res) => {
    let usql = `select *from uber_eats.customer where email_id = '${req.body.email_id}' `;
    pool.query(usql, (err, result) => {
      if (err) {
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end("Error in Data");
      }  else if (result && result.length > 0 ) {
        console.log("User exists");
        res.writeHead(401, {
          'Content-Type': 'text/plain'
        });
        res.end('USER_EXISTS');
      } else {
        var hashedPassword = passwordHash.generate(req.body.password);
        let sql = "INSERT INTO uber_eats.customer (cust_name, email_id, pwd, country, dob) VALUES (?,?,?,?,?)";
      
        pool.query(sql, [req.body.name, req.body.email_id, hashedPassword, req.body.country, req.body.dob],(err, result) => {
          console.log("result from db", result);
          if (err) {
            res.writeHead(500, {
              'Content-Type': 'text/plain'
            });
            res.end("Error in Data");
          }
          if (result && result.affectedRows > 0 ) {
            console.log("user added");
            res.writeHead(200, {
              'Content-Type': 'text/plain'
            })
            res.end('USER_ADDED');
          }
        });

      }
    });   
  });

  router.post('/restaurant', (req, res) => {
    let usql = `select * from uber_eats.restaurant where email_id = '${req.body.email_id}' `;
    pool.query(usql, (err, result) => {
      if (err) {
          res.writeHead(500, {
            'Content-Type': 'text/plain'
          });
          res.end("Error in Data");
      } else if (result && result.length > 0 ) {
          console.log("User exists");
          res.writeHead(401, {
            'Content-Type': 'text/plain'
          });
          res.end('USER_EXISTS');
      } else {
        var hashedPassword = passwordHash.generate(req.body.password);
        let sql = "INSERT INTO uber_eats.restaurant (resto_name, email_id, pwd, location) VALUES (?,?,?,?)"
      
        pool.query(sql, [req.body.name, req.body.email_id, hashedPassword, req.body.location],(err, result) => {
          console.log("result from db", result);
          if (err) {
            res.writeHead(500, {
              'Content-Type': 'text/plain'
            });
            res.end("Error in Data");
          }  
          if (result && result.affectedRows > 0 ) {
            console.log("user added");
            res.writeHead(200, {
              'Content-Type': 'text/plain'
            })
            res.end('USER_ADDED');
          }
        });
      }
    });   
  });

  module.exports = router;