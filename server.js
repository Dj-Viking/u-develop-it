const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.listen(PORT, () => {
  console.log("\x1b[32m", `Server running now on port ${PORT}!`, "\x1b[00m");
});
app.get('/', (req, res) => {
  res.json({
    message: "Hello World"
  });
});
//Default response for any othe request(not found) catch all
// must go below all other routes because this catches anything 
// before any other routes placed below this one.
app.use((req, res) => {
  res.status(404).end();
})
