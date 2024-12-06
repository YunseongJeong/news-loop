// models/database.js
// mysql dbms에 연결해주는 model

const mysql = require('mysql2');
const env = process.env.NODE_ENV || 'development';
const config = require(process.cwd() + '/config/config.json')[env];

// mysql dbms와 연결을 만든다.
const pool = mysql.createPool({
    host: config.host,
    user: config.username,
    password: config.password,
    database: config.database,
    waitForConnections: true,
    connectionLimit: 10,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
}).promise();

module.exports = pool;