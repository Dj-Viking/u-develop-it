const sqlite3 = require('sqlite3').verbose();
const { Statement } = require('sqlite3');


//following the express.json middle ware we will place the middleware for
// the server to connect to the database
const db = new sqlite3.Database('./db/election.db', err => {
  if (err) {
    return console.error(err.message);
  } else {
    console.log("\x1b[33m", "Connected to the election database!", "\x1b[00m");
  }
});

module.exports = db;