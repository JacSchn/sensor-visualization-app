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
    front_usb: false,
    rear_usb: false,
    rp_lidar: false
  }
  res.render('home.pug', {jsStringify, SensorStates});
})

app.get('/visuals', (req, res) => {
  res.render('visual.pug')
})

//Point 2
app.get('/getState', (req, res) => {
  const end = new Date().getTime() + 15000;
  let hasUpdate = LocalStore.getHasUpdate();
  let curTime = new Date().getTime();
  console.log(hasUpdate)
  Data = {}
  //15000 Miliseconds=15 seconds
  while(hasUpdate == 'false' && curTime<=end)
  {
    curTime = new Date().getTime()
    hasUpdate = LocalStore.getHasUpdate();
  }
  
  if(hasUpdate) //15 seconds
  {
    //const f = db.GetStatus(rear_usb);
    //const r = db.GetStatus(front_usb);
    //const rp = db.GetStatus(rp_lidar);

    const f = LocalStore.getState('front_usb');
    const r = LocalStore.getState('rear_usb');
    const rp = LocalStore.getState('rp_lidar');
    Data['front_usb'] = f;
    Data['rear_usb'] = r;
    Data.rp_lidar = rp;
    //console.log(Data)
    LocalStore.setHasUpdate(false);
    res.json(Data);
  }else{
    res.json(Data);
  }
})

app.post('/updateState/:sensor', (req, res) => {
  // 5. Set state of microcontroller
  try{
    let sensor = req.params.sensor
    let state = req.headers.state
    console.log(sensor)
    console.log(state)
    LocalStore.setState(sensor, state)
    LocalStore.setHasUpdate(true)
    res.sendStatus(200)
  }
  catch{
    res.sendStatus(400)
  }
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

app.get('/getMicro/:timespan', (req, res) => {
  res.json(getMicroData(timespan));
})

//Step 6
app.get('/microState', async (req, res, sensorName) => {
  //Retreive client's guess of what microcontroller or sensor state is
  //If there is no guess, assume the client has no info about current state
  const microState = await LocalStore.getState(sensorName, sensorState)
  res.send({
      sensorName: microState
  })
  //Or res.send(microState)
  //Or return microState?
})


app.post('/micro', express.json(), (req, res) => {
  try{
    let sensors = req.body.sensor;
    //console.log(req.body.sensor[0].name)
    for (s in sensors) {
      //DB.SaveStatus(s.name, s.state, []);
      //DB.SaveHistorical(s.name, [], [], s.timestamp);
      //console.log(s.name);
    }
    res.sendStatus(200);
  }
  catch{
    res.sendStatus(500);
  }
})

app.listen(PORT, () => {
  console.log(`App running on localhost:${PORT}`);
  console.log('Press Ctrl+C to quit.');
});