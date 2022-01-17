const { response } = require("express");
const express = require("express");
const router = express.Router();
const pool = require('../sqlpool.js');

router.get('/items/:resto_id', (req, res) => {
    console.log("Inside fetch data items for restaurant DB call");
    let sql = "select mi.item_id, mi.item_name, mi.item_description, mi.item_price, mi.item_image, mi.item_category, "
    + " ms.menu_section_id, ms.menu_section_name, ms.resto_id from menu_items mi left outer join menu_sections ms "
    + " on mi.menu_section_id = ms.menu_section_id WHERE mi.resto_id = ?";
    pool.query(sql, req.params.resto_id, (err, result) => {
      if (err) {
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        console.log("DB error occured", err);
        res.end("Database Error");
      }
      if (result && result.length > 0) {
        console.log("Successfully fetched the items for the restaurant:", result);
        let itemObject = { item_id: result[0].item_id, item_name: result[0].item_name, item_description: result[0].item_description, 
        item_price: result[0].item_price, item_image: result[0].item_image, menu_section_id: result[0].menu_section_id, menu_section_name: result[0].menu_section_name,
        resto_id: result[0].resto_id};
        res.writeHead(200, {
          'Content-Type': 'text/plain'
        });
        console.log(JSON.stringify(itemObject));
        res.end(JSON.stringify(result));
      }
    });
  });

  router.get('/menuitem/:item_id', (req, res) => {
    console.log("Inside Get menu item DB call");
    let sql = "SELECT mi.item_id, mi.item_name, mi.item_description, mi.item_price, mi.item_image, mi.resto_id, "
    + " mi.menu_section_id, ms.menu_section_name " 
    + " FROM menu_items mi "
    + " INNER JOIN menu_sections ms "
    + " ON mi.menu_section_id = ms.menu_section_id "
    + " WHERE mi.item_id = ?";
    pool.query(sql, req.params.item_id, (err, result) => {
      if (err) {
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end("Database Error");
      }
      if (result && result.length > 0) {
        console.log("Menu items fetched successfully", result);  
        let itemObject = { item_id: result[0].item_id, item_name: result[0].item_name, item_description: result[0].item_description, item_price: result[0].item_price, item_image: result[0].item_image, menu_section_id: result[0].menu_section_id, menu_section_name: result[0].menu_section_name};
        res.writeHead(200, {
          'Content-Type': 'text/plain'
        });
        console.log(JSON.stringify(itemObject));
        res.end(JSON.stringify(itemObject));
      }
    });
  });

  router.post('/items', (req, res) => {
    console.log("Inside post menu items to DB");
    let sql = `INSERT INTO uber_eats.menu_items (resto_id, menu_section_id, item_name, item_description, item_image, item_price)VALUES('${req.body.user_id}', 
    (SELECT menu_section_id FROM uber_eats.menu_sections WHERE menu_section_name = '${req.body.menu_section_name}' AND resto_id = '${req.body.user_id}'), 
    '${req.body.item_name}', '${req.body.item_description}','${req.body.item_image}', ${req.body.item_price})`;

    pool.query(sql, (err, result) => {
      console.log("result after inserting item into DB", result);
      if (err) {
        console.log(err);
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end("Database Error");
      }
      if (result && result.affectedRows > 0) {
        console.log("Item Successfully inserted");
        res.writeHead(200, {
          'Content-Type': 'text/plain'
        });
        res.end('ITEM_ADDED');
      }
      else if (result && result.length > 0 && result[0][0].status === 'ITEM_EXISTS') {
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end(result[0][0].status);
      }
    });
  });

  router.post('/itemsupdate', (req, res) => {
    console.log("Inside update menu items", req.body.item_price);   
    let sql = `update uber_eats.menu_items set item_name = '${req.body.item_name}', item_description =  '${req.body.item_description}',
    item_price = '${req.body.item_price}' WHERE item_id = '${req.body.item_id}' AND resto_id = '${req.body.user_id}'`;
    pool.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end("Database Error");
      }
      if (result) {
        console.log("Items updated successfully");  
        res.writeHead(200, {
          'Content-Type': 'text/plain'
        });
        res.end('ITEM_UPDATED');
      }
      else if (result && result.length > 0 && result[0][0].status === 'ITEM_EXISTS') {
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end('INTERNAL_SERVER_ERROR');
      }
    });
  });

  router.post('/itemdelete', (req, res) => {
    let sql = "DELETE from uber_eats.menu_items where item_id = ?";
    pool.query(sql, req.body.item_id, (err, result) => {
      console.log("Result after deleteing item", result);
      if (err) {
        console.log(err);
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end("Database Error");
      }
      if (result && result.affectedRows > 0) {
        console.log("Item deleted successfully.");
        res.writeHead(200, {
          'Content-Type': 'text/plain'
        });
        res.end('ITEM_DELETED');
      }
      else if (result && result.length > 0 && result[0][0].status === 'NO_RECORD') {
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end('NO_RECORD');
      }
    });
  });

module.exports = router;