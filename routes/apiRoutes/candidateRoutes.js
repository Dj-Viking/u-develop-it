const express = require('express');
const router = express.Router();
const db = require('../../db/database.js');
const inputCheck = require('../../utils/inputCheck.js');

// GET all candidates and respond with JSON object of candidates array 
//all method runs the SQL query and executes the callback with 
// all the resulting rows that match the query
router.get('/candidates', (req, res) => {
  const sqlGetAllQ = `SELECT candidates.*, parties.name AS party_name FROM candidates LEFT JOIN parties ON candidates.party_id = parties.id`;
  //necesarry argument but since we are displaying all
  // we just pass in a blank array for the params argument
  const params = [];
  db.all(sqlGetAllQ, params, function(err, rows) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    } else {
      console.log("\x1b[33m", "SQL query to the database", "\x1b[00m");
      console.log(this.sql);
      res.json({
        message: 'Search Success',
        data: rows
      });
    }
    console.log("\x1b[33m", "responding to client the rows array of candidate objects", "\x1b[00m");
    console.log(rows);
  });
});

// GET a single candidate
router.get('/candidate/:id', (req, res) => {
  const sqlGetCandidate = `SELECT candidates.*, parties.name AS party_name FROM candidates LEFT JOIN parties ON candidates.party_id = parties.id WHERE candidates.id = ?`;
  const params = [req.params.id];
  console.log("\x1b[33m", "showing the client URL query itself sent by client", "\x1b[00m");
  console.log(req.params);

  db.get(sqlGetCandidate, params, function(err, row) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    } else {
      console.log("\x1b[33m", "SQL query to the database", "\x1b[00m");
      console.log(this.sql);
      res.json({
        message: 'Search Success',
        data: row
      });
    }
    console.log("\x1b[33m", "showing the row which the client queried", "\x1b[00m");
    console.log(row);
  });
});

//create a candidate
//if we try to add an entry with the same id
// the SQL CONSTRAINT will protect the table from getting duplicate ids
//can destructure body from the req object here { body } as an argument
router.post('/candidate', (req, res) => {
  const errors = inputCheck(req.body, 'first_name', 'last_name', 'industry_connected');
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }
  const sqlCreateQ = `INSERT INTO candidates (first_name, last_name, industry_connected) VALUES (?,?,?)`;
  //these params will fill in the ?'s in the sql query
  const params = [req.body.first_name, req.body.last_name, req.body.industry_connected];
  console.log("\x1b[33m", "showing the client URL query itself sent by client", "\x1b[00m");
  console.log(req.body);
  console.log(req.params);
  //ES5 function for use of "this" keyword
  db.run(sqlCreateQ, params, function(err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.json({
        message: 'Create Success',
        data: req.body,
        id: this.lastID
      });
      console.log("\x1b[31m", "Client adding a candidate", "\x1b[00m");
      console.log(this.sql);
      console.log(this);
      console.log("\x1b[31m", "Number of changes executed.", "\x1b[00m");
      console.log(this.changes)
    }
  });
});

//PUT a new value into candidates objects party_id
// if they want to change affiliation
router.put('/candidate/:id', (req, res) => {
  const errors = inputCheck(req.body, 'party_id');
  if (errors) {
    res.status(400).json({error: errors});
    return;
  }
  const sql = `UPDATE candidates SET party_id = ? WHERE id = ?`;
  const params = [req.body.party_id, req.params.id];
  console.log("\x1b[33m", "showing the client URL query itself sent by client", "\x1b[00m");
  console.log(req.body);
  console.log(req.params);

  db.run(sql, params, function(err, result) {
    if (err) {
      res.sendStatus(400).json({error: err.message});
      return;
    } else {
      res.json({
        message: 'Put Success',
        data: req.body,
        changes: this.changes
      });
    }
    console.log("\x1b[31m", "Client changing a value on a candidate", "\x1b[00m");
    console.log(this.sql);
    console.log(this);
    console.log("\x1b[31m", "Number of changes executed.", "\x1b[00m");
    console.log(this.changes)
  });
});

//DELETE route from server to database
router.delete('/candidate/:id', (req, res) => {
  const sqlDeleteQ = `DELETE FROM candidates WHERE id = ?`;
  const params = [req.params.id];
  //DELETE a candidate
  //using es5 function so we can make this refer to the database object
  //where the 1 is is the paramater argument which can be 
  // an array that holds multiple values
  db.run(sqlDeleteQ, params, function(err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    } else {
      res.json({
        message: 'Delete Success',
        changes: this.changes
      });
      console.log("\x1b[31m", "Deleting a candidate", "\x1b[00m");
      console.log(this.sql);
      //this will be the statement object which contains
      // lastID which is the primary key ID that was inserted,
      // if it was 0 there was no insertion
      console.log(this);
      //result is undefined because .run() doesn't return any result data
      //console.log(result);
      console.log("\x1b[31m", "Number of changes executed.", "\x1b[00m");
      console.log(this.changes);
    }
  });
});

module.exports = router;