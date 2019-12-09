const express = require('express')
var mongoose = require('mongoose');
var CarData = require('./models/CarData')
var routes = require('./routes');
var cors = require('cors'); 
var mqtt = require('mqtt')
const app = express()
const port = 3000

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect('mongodb://localhost:27017/CarProject'); // connect to database

var options = {
    port: 13596,
    host: 'mqtt://farmer.cloudmqtt.com',
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username: '',
    password: '',
    keepalive: 60,
    reconnectPeriod: 1000,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    clean: true,
    encoding: 'utf8'
};

var originsWhitelist = [
    'http://localhost:4200'      //this is my front-end url for development
  ];
  var corsOptions = {
    origin: function(origin, callback){
          var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
          callback(null, isWhitelisted);
    },
    credentials:true
  }
  //here is the magic
  app.use(cors(corsOptions));

var client = mqtt.connect('mqtt://farmer.cloudmqtt.com', options);

client.on('connect', function() { // When connected
    console.log('connected');
    // subscribe to a topic
    client.subscribe('car', function() {
        // when a message arrives, do something with it
        client.on('message', function(topic, payload) {
            const carData = JSON.parse(payload.toString())

            var data = new CarData({
                license_plate: carData.plate,
                speed: carData.speed,
                rpm: carData.rpm,
                throttle_position: carData.throttle_position,
                gps: carData.gps,
                timestamp: carData.time
            });

            data.save(function (err) {
                if (err) throw err;
            });
        });
    });
});

app.use(function(req, res, next) {
    // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');

  next();
});

app.use('/api', routes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))