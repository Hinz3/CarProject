const express = require('express')
var mongoose = require('mongoose');
var CarData = require('./models/CarData')
var mqtt = require('mqtt')
const app = express()
const port = 3000

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

                console.log("Added data for: " + carData.plate);
            });
        });
    });
});

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))