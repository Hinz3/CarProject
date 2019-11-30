const express = require('express')
var mqtt = require('mqtt')
const app = express()
const port = 3000

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
            const obj = JSON.parse(payload.toString())
            console.log(obj)
        });
    });
});

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))