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

var connectLiveReload = require("connect-livereload")

const express = require('express');
const bodyParser = require("body-parser");

const app = express();
const path = require('path');

app.use(connectLiveReload())
app.use(bodyParser.urlencoded({extended: false}));

// view engine setup
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 9000

// Go to localhost:9090 in your browser while the program is running
app.get('/', (req, res) => {
  LocalStore.updateState()
  Data = {
    value1: "Something good",
    cake: LocalStore.getUpdate()
  }
  res.render('home.pug', Data)
})

//Point 2
app.get('/getState', (req, res) => {
  const start = new Date().getTime();
  
    const end = new Date().getTime() + 15000;
    const hasUpdate = LocalStore.getHasUpdate();
        //15000 Miliseconds=15 seconds
    while(hasUpdate == false && Date().getTime()<=end)
    {}
    
    if(hasUpdate) //15 seconds
    {
      //const f = db.GetStatus(rear_usb);
      //const r = db.GetStatus(front_usb);
      //const rp = db.GetStatus(rp_lidar);

      const f = LocalStore.getState(front_usb);
      const r = LocalStore.getState(rear_usb);
      const rp = LocalStore.getState(rp_lidar);

      Data = {
      front_usb: f,
      rear_usb: r,
      rp_lidar: rp
      }
      res.json(Data);
    }
      res.json(Data);
  })

app.post('/updateState/:sensor', (req, res) => {
  // 5. Set state of microcontroller
  try{
    const sensor = req.params.sensor
    const state = req.headers.state

    LocalStore.setState(sensor, state)
    LocalStore.setHasUpdate(true)
    res.send(200)
  }
  catch{
    res.send(400)
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


app.post('/micro', (req, res) => {
  try{
    const sensors = req.body.sensor;

  for (s in sensors) {
    //DB.SaveStatus(s.name, s.state, []);
    //DB.SaveHistorical(s.name, [], [], s.timestamp);
    console.log(s);
  }
  res.send(200);
  }
  catch{
    res.send(500);
  }
})

app.listen(PORT, () => {
  console.log(`App running on localhost:${PORT}`);
  console.log('Press Ctrl+C to quit.');
});