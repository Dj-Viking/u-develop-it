const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const inputCheck = require('./utils/inputCheck.js');
const { Statement } = require('sqlite3');
//verbose will produce messages in terminal regarding the state of the runtime.
// this can help explain what sqlite is doing
const sqlite3 = require('sqlite3').verbose();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//following the express.json we will place the middleware for
// the server to connect to the database
const db = new sqlite3.Database('./db/election.db', err => {
  if (err) {
    return console.error(err.message);
  } else {
    console.log("\x1b[33m", "Connected to the election database!", "\x1b[00m");
  }
});

//wrapping the port listen with this db.on('open') to ensure
// that the server.js file is connected to the database before
// the server starts
// i looks like this changed later, maybe this was just to demonstrate this function?
db.on('open', () => {
  app.listen(PORT, () => {
    console.log("\x1b[32m", `Server running now on port ${PORT}!`, "\x1b[00m");
  });
});

app.get('/', (req, res) => {
  res.json({
    message: "Hello World"
  });
});

// GET all candidates and respond with JSON object of candidates array 
//all method runs the SQL query and executes the callback with 
// all the resulting rows that match the query
app.get('/api/candidates', (req, res) => {
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
app.get('/api/candidate/:id', (req, res) => {
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

//DELETE route from server to database
app.delete('/api/candidate/:id', (req, res) => {
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
  
//create a candidate
//if we try to add an entry with the same id
// the SQL CONSTRAINT will protect the table from getting duplicate ids
//can destructure body from the req object here
app.post('/api/candidate', ({ body }, res) => {
  const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }
  const sqlCreateQ = `INSERT INTO candidates (first_name, last_name, industry_connected) VALUES (?,?,?)`;
  //these params will fill in the ?'s in the sql query
  const params = [body.first_name, body.last_name, body.industry_connected];
  //ES5 function for use of "this" keyword
  db.run(sqlCreateQ, params, function(err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.json({
        message: 'Create Success',
        data: body,
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
  
//Default response for any other request(not found) catch all
// must go below all other routes because this catches anything 
// before any other routes placed below this one.
app.use((req, res) => {
  res.status(404).end();
});
