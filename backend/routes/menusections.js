const express = require("express");
const router = express.Router();
const pool = require('../sqlpool.js');

router.get('/sections/:resto_id', (req, res) => {
    console.log("Inside get menu section db call");
    let sql = "SELECT menu_section_id, menu_section_name FROM uber_eats.menu_sections WHERE resto_id = ?";
    pool.query(sql, req.params.resto_id, (err, result) => {
      if (err) {
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end("Database Error");
      }
      if (result && result.length > 0) {
        console.log("Menu sections fetched successfully", result);  
        let menu_sections = { menu_section_id: result[0].menu_section_id, menu_section_name : result[0].menu_section_name};
        res.writeHead(200, {
          'Content-Type': 'text/plain'
        });
        res.end(JSON.stringify(result));
      }
    });
  });

  router.get('/sectionitem/:menu_section_id', (req, res) => {
    let sql = `select *from uber_eats.menu_sections where menu_section_id = '${req.params.menu_section_id}' `;
    pool.query(sql, (err, result) => {
      if (err) {
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end("Database Error");
      }
      if (result && result.length > 0)  {
        res.writeHead(200, {
          'Content-Type': 'text/plain'
        });
        res.end(JSON.stringify(result));
      }
    });
  });

  router.post('/sections', (req, res) => {
    console.log("Inside Add new menu section db call");
    let sql = "INSERT INTO uber_eats.menu_sections(menu_section_name, resto_id)VALUES(?, ?)";
    pool.query(sql, [req.body.menu_section_name, req.body.user_id], (err, result) => {
      console.log("result",result);
      if (err) {
        console.log(err);
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end("Database Error");
      }
      if (result && result.affectedRows > 0) {
        console.log("Menu section successfully added.");
        res.writeHead(200, {
          'Content-Type': 'text/plain'
        });
        res.end('SECTION_ADDED');
      }
      else if (result && result.length > 0 && result[0][0].status === 'SECTION_EXISTS') {
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end('SECTION_EXISTS');
      }
    });
  });

  router.post('/sectionsupdate', (req, res) => {
    let sql = `update uber_eats.menu_sections set menu_section_name = '${req.body.menu_section_name}' where menu_section_id = '${req.body.menu_section_id}' `;
    pool.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end("Database Error");
      }
      if (result) {
        res.writeHead(200, {
          'Content-Type': 'text/plain'
        });
        res.end('SECTION_UPDATED');
      }
      else {
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end('SECTION_EXISTS');
      }
    });
  });

  router.post('/sectiondelete', (req, res) => {
    let sql = "DELETE FROM uber_eats.menu_sections WHERE menu_section_id = ?";
    pool.query(sql, req.body.menu_section_id, (err, result) => {
      if (err) {
        console.log(err);
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end("Database Error");
      }
      if (result && result.length > 0) {
        res.writeHead(200, {
          'Content-Type': 'text/plain'
        });
        res.end('SECTION_DELETED');
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