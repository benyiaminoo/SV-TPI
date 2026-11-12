const {DB_HOST, DB_NAME, DB_USER, DB_PASS} = process.env;
const mysql = require('mysql2/promise')

const db = mysql.createPool({
    host:DB_HOST,
    database:DB_NAME,
    user:DB_USER,
    password:DB_PASS,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    dateStrings: true // ← las fechas llegan como texto

})

module.exports = db