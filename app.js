var livereload = require('livereload');
var server = livereload.createServer();
server.watch(__dirname + "/public");

// automatically refresh home page
server.server.once("connection", () => {
  setTimeout(() => {
    server.refresh("/")
  }, 100);
});

var connectLiveReload = require("connect-livereload")

const express = require('express');
const app = express();
const path = require('path');

app.use(connectLiveReload())

// view engine setup
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 9000

// Go to localhost:9090 in your browser while the program is running
app.get('/', (req, res) => {
  Data = {
    value1: "Something good",
    cake: "Not a pie"
  }
  res.render('home.pug', Data)
})


app.listen(PORT, () => {
  console.log(`App running on localhost:${PORT}`);
  console.log('Press Ctrl+C to quit.');
});