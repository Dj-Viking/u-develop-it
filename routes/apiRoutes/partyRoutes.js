const express = require('express');
const router = express.Router();
const db = require('../../db/database.js');

//GET routes for /parties
router.get('/parties', (req, res) => {
  const sql = `SELECT * FROM parties`;
  const params = [];
  console.log("\x1b[33m", "showing the client URL query itself sent by client", "\x1b[00m");
  console.log(req.params);
  db.all(sql, params, function(err, rows) {
    if (err) {
      res.status(500).json({error: err.message});
      return;
    } else {
      console.log("\x1b[33m", "SQL query to the database", "\x1b[00m");
      console.log(this.sql);
      res.json({
        message: 'success',
        data: rows
      });
    }
    console.log("\x1b[33m", "responding to client the rows array of party objects", "\x1b[00m");
    console.log(rows);
  });
});

//GET route for /parties/:id
router.get('/party/:id', (req, res) => {
  const sql = `SELECT * FROM parties WHERE id = ?`;
  const params = [req.params.id];
  console.log("\x1b[33m", "showing the client URL query itself sent by client", "\x1b[00m");
  console.log(req.params);
  db.get(sql, params, function(err, row) {
    if (err) {
      res.status(400).json({error: err.message});
      return;
    } else {
      console.log("\x1b[33m", "SQL query to the database", "\x1b[00m");
      console.log(this.sql);
      res.json({
        message: 'success',
        data: row
      });
    }
    console.log("\x1b[33m", "showing the row which the client queried", "\x1b[00m");
    console.log(row);
  });
});

//DELETE party by id
router.delete('/party/:id', (req, res) => {
  const sql = `DELETE FROM parties WHERE id = ?`;
  const params = [req.params.id];
  db.run(sql, params, function(err, result) {
    if (err) {
      res.status(400).json({error: res.message});
      return;
    } else {
      res.json({
        message: 'Delete Success',
        changes: this.changes
      });
    }
    console.log("\x1b[31m", "Deleting a party", "\x1b[00m");
    console.log(this.sql);
    console.log(this);
    console.log("\x1b[31m", "Number of changes executed.", "\x1b[00m");
    console.log(this.changes);
  });
});

module.exports = router;