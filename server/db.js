const { Client } = require('pg');

const client = new Client({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.DB_PORT,
})


client.connect(function(err) {
  if (err) throw err;
  console.log("Connected to postGres!");
});


module.exports = client;