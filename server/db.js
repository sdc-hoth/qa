const { Client } = require('pg');

const client = new Client({
  user: 'xuxia',
  host: 'localhost',
  database: 'qa',
  password: 'postgres',
  port: 5432,
})


client.connect(function(err) {
  if (err) throw err;
  console.log("Connected to postGres!");
});


module.exports = client;