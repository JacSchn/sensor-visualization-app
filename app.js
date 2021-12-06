var livereload = require('livereload');
var server = livereload.createServer();
server.watch(__dirname + "/public");
const DB = require('./functions/firestore');

// automatically refresh home page
server.server.once("connection", () => {
  setTimeout(() => {
    server.refresh("/")
  }, 100);
});


//CHANGE IS HERE

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
    res.render('home.pug')
})

app.get('/database', async (req,res)=>{
  await DB.SaveStatus("LED-Fixture","On",[]);
  const stat = await DB.GetStatus("LED-Fixture");

  await DB.SaveHistorical("LiDAR",["00:00:00","00:00:01","00:00:03"],["12.36m","7.89m","3.12m"],"7:12:36pm");
  const hist = await DB.GetHistorical("LiDAR");

  res.send({
    "testStatus": stat,
    "testHist": hist
  });
})


app.listen(PORT, () => {
  console.log(`App running on localhost:${PORT}`);
  console.log('Press Ctrl+C to quit.');
});