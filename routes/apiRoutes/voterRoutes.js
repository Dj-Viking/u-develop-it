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

//POST a voter into the database
router.post('/voter', (req, res) => {
  const errors = inputCheck(req.body, 'first_name', 'last_name', 'email');
  if (errors) {
    res.status(400).json({
      error: errors
    });
    return;
  }

  const sql = `
    INSERT INTO voters (first_name, last_name, email) 
    VALUES (?,?,?)
  `;
  const params = [req.body.first_name, req.body.last_name, req.body.email];
  console.log("\x1b[33m", "showing the client URL query itself sent by client", "\x1b[00m");
  console.log(req.body);
  console.log(req.params);
  db.run(sql, params, function(err, result) {
    if (err) {
      res.status(400).json({
        error: err.message
      });
      return;
    } else {
      res.json({
        message: 'POST voter success',
        data: req.body,
        id: this.lastID
      });
    }
    console.log("\x1b[31m", "Client adding a voter", "\x1b[00m");
    console.log(this.sql);
    console.log(this);
    console.log("\x1b[31m", "Number of changes executed.", "\x1b[00m");
    console.log(this.changes);
  })
});

//PUT voter info to update existing voter email
router.put('/voter/:id', (req, res) => {
  //data validation
  const errors = inputCheck(req.body, 'email');
  if (errors) {
    res.status(400).json({error: errors});
    return;
  }

  //prepare statement
  const sql = `UPDATE voters SET email = ? WHERE id = ?`;
  const params = [req.body.email, req.params.id];
  console.log("\x1b[33m", "showing the client URL query itself sent by client", "\x1b[00m");
  console.log(req.body);
  console.log(req.params);
  //execute statement
  db.run(sql, params, function(err, result) {
    if (err) {
      res.status(400).json({error: err.message});
      return;
    } else {
      res.json({
        message: "Update Success",
        data: req.body,
        changes: this.changes
      });
    }
    console.log("\x1b[31m", "Client updating voter email", "\x1b[00m");
    console.log(this.sql);
    console.log(this);
    console.log("\x1b[31m", "Number of changes executed.", "\x1b[00m");
    console.log(this.changes);
  });
});

//DELETE voter route
router.delete('/voter/:id', (req, res) => {
  const sql = `DELETE FROM voters WHERE id = ?`;
  console.log("\x1b[33m", "showing the client URL query itself sent by client", "\x1b[00m");
  console.log(req.body);
  db.run(sql, req.params.id, function(err, result) {
    if (err) {
      res.status(400).json({error: err.message});
      return;
    } else {
      res.json({
        message: 'Delete Success',
        changes: this.changes
      });
    }
    console.log("\x1b[31m", "Client deleting a voter", "\x1b[00m");
    console.log(this.sql);
    console.log(this);
    console.log("\x1b[31m", "Number of changes executed.", "\x1b[00m");
    console.log(this.changes);
  });
});

module.exports = router;