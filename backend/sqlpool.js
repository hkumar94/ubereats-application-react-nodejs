const mysql = require('mysql');
const myPort = 3306;
const pool = mysql.createPool({
    connectionLimit: 100,
    host: 'sql-database-1.cxibvgtjdpev.us-east-2.rds.amazonaws.com',
    user: 'admin',
    port: myPort,
    password: 'shradha123',
    database: 'uber_eats'
});

pool.getConnection((err) => {
    if(err){
      console.log("DB not connected!");
      throw 'Error occured: ' + err;
    }
  });
  
module.exports = pool;

