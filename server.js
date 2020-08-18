//setup
const express = require('express');
//database
const db = require('./db/database.js');
//PORT
const PORT = process.env.PORT || 3001;
//APP
const app = express();
// const { Statement } = require('sqlite3');
//verbose will produce messages in terminal regarding the state of the runtime.
// this can help explain what sqlite is doing
// const sqlite3 = require('sqlite3').verbose();

//routes
const apiRoutes = require('./routes/apiRoutes');
//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//use routes 
// MUST be placed after middleware for POST requests
// to be parsed and get defined data
app.use('/api', apiRoutes);

//wrapping the port listen with this db.on('open') to ensure
// that the server.js file is connected to the database before
// the server starts
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
  
//Default response for any other request(not found) catch all
// must go below all other routes because this catches anything 
// before any other routes placed below this one.
app.use((req, res) => {
  res.status(404).end();
});
