var livereload = require('livereload');
var server = livereload.createServer();
server.watch(__dirname + "/public");
const DB = require('./functions/firestore');
const LocalStore = require('./functions/localStorage')

// automatically refresh home page
server.server.once("connection", () => {
  setTimeout(() => {
    server.refresh("/")
  }, 100);
});


//CHANGE IS HERE

var connectLiveReload = require("connect-livereload")

const express = require('express');
const bodyParser = require("body-parser");
const jsStringify = require('js-stringify');

const app = express();
const path = require('path');

app.use(connectLiveReload())
app.use(bodyParser.urlencoded({extended: false}));

// view engine setup
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 9000

// Go to localhost:9000 in your browser while the program is running
app.get('/', (req, res) => {
  SensorStates = {
    front_usb: true,
    rear_usb: false,
    rp_lidar: true
  }
  res.render('home.pug', {jsStringify, SensorStates});
})

app.get('/visuals', (req, res) => {
  res.render('visual.pug')
})


app.post('/updateState/:sensor', (req, res) => {
  // 5. Set state of microcontroller
  console.log(`${req.params.sensor} now has a state ${req.headers.state}`)
  res.sendStatus(200);
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