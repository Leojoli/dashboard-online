const express = require("express");
const app = express();
const port = 5000 || env.PORT;

process.env.PWD = process.cwd();

app.use(express.static(process.env.PWD + "/"));

app.get("/store", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(port, () => {
  console.log(`Coneting: http://localhost:${port}`);
});
