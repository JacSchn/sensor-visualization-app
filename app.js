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

app.post('/updateState/:sensor', (req, res) => {
  // 5. Set state of microcontroller
  LocalStore.setState()

})

//#2
app.get('/getState', (req, res) => {
  var start = new Date().getTime();
  
  Data = {};
    var end = new Date().getTime() + 15000;
    var hasUpdate=LocalStore.getHasUpdate();
        //1500 Miliseconds=15 seconds
    while(hasUpdate==false && Date().getTime()<=end)
    {}
    
    if(hasUpdate) //15 seconds
    {
      var f=db.GetStatus(rear_usb);
      var r=db.GetStatus(front_usb);
      var rp=db.GetStatus(rp_lidar);

      Data = {
      front_usb: f,
      rear_usb: r,
      rp_lidar: rp
      }
      res.json(Data);
    }
      res.json(Data);
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

//#9
app.get('/getMicro/:timespan', (req, res) => {
  res.json(getMicroData(timespan));
}


app.listen(PORT, () => {
  console.log(`App running on localhost:${PORT}`);
  console.log('Press Ctrl+C to quit.');
});