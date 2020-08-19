const express = require('express');
const router = express.Router();
const db = require('../../db/database.js');
const inputCheck = require('../../utils/inputCheck.js');

//get votes 
router.get('/votes', (req, res) => {
  const sql = `
    SELECT candidates.*, parties.name AS party_name,
    COUNT (candidate_id) AS count
    FROM votes
    LEFT JOIN candidates ON votes.candidate_id = candidates.id
    LEFT JOIN parties ON candidates.party_id = parties.id
    GROUP BY candidate_id ORDER BY count DESC 
  `;
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
        message: "Get votes success",
        data: rows
      });
    }
  });
});


//post a vote
router.post('/vote', (req, res) => {
  //validate!
  const errors = inputCheck(req.body, 'voter_id', 'candidate_id');
  if (errors) {
    res.status(400).json({
      error: errors
    });
  }
  
  //prepare statement
  const sql = `INSERT INTO votes (voter_id, candidate_id) VALUES (?,?)`;
  const params = [req.body.voter_id, req.body.candidate_id];
  console.log("\x1b[33m", "showing the client URL query itself sent by client", "\x1b[00m");
  console.log(req.body);
  console.log(req.params);

  //execute statment
  db.run(sql, params, function(err, result) {
    if (err) {
      res.status(400).json({
        message: "Voter cannot vote more than once!",
        error: err.message
      });
      return;
    } else {
      res.json({
        message: 'Vote Post Success',
        data: req.body,
        id: this.lastID
      });
    }
    console.log("\x1b[31m", "Client casting a vote", "\x1b[00m");
    console.log(this.sql);
    console.log(this);
    console.log("\x1b[31m", "Number of changes executed.", "\x1b[00m");
    console.log(this.changes);
  });
});

//

module.exports = router;