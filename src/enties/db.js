// get the client
const mysql = require('mysql2');

// create the connection to database
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1914',
    database: 'online_telecon'
});

module.exports = con;