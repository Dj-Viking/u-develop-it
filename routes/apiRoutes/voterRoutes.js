const express = require('express');
const router = express.Router();
const db = require('../../db/database.js');
const inputCheck = require('../../utils/inputCheck.js');

router.get('/voters', (req, res) => {
  const sql = `SELECT * FROM voters ORDER BY last_name`;
  const params = [];

  db.all(sql, params, function(err, rows) {
    if (err) {
      res.status(500).json({error: err.message});
      return;
    } else {
      console.log("\x1b[33m", "SQL query to the database", "\x1b[00m");
      console.log(this.sql);
      res.json({
        message: 'Get voters Success',
        data: rows
      });
    }
    console.log("\x1b[33m", "responding to client the rows array of voters objects", "\x1b[00m");
    console.log(rows);
  });
});

//get single voter
router.get('/voter/:id', (req, res) => {
  const sql = `SELECT * FROM voters WHERE id = ?`;
  const params = [req.params.id];

  db.get(sql, params, function(err, row) {
    if (err) {
      res.status(400).json({error: err.message});
      return;
    } else {
      console.log("\x1b[33m", "SQL query to the database", "\x1b[00m");
      console.log(this.sql);
      res.json({
        message: 'Get Single Voter Success',
        data: row
      });
    }
    console.log("\x1b[33m", "responding to client the row of a single voter", "\x1b[00m");
    console.log(row);
  });
});

module.exports = router;