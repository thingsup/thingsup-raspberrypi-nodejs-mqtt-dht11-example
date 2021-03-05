const mqtt = require("mqtt");
const fs = require("fs");
const sensor = require("node-dht-sensor");

/*
*	Thingsup MQTT Service is available on below server
*	Host: mqtt.thingsup.io
*	Port: 1883(Secure MQTT)/ 8083(Secure MQTT over Websockets)
*/

const CaFile = fs.readFileSync('./AmazonRootCA1.pem');

const options = {
	clientId: "mqttjs01",
	port: 1883,
	protocol: 'mqtts',
	username: "<AccountID>:<Name you specified>", //e.g. 3p309xhfhfhfhf:TestDevice1
	password: "<Your MQTT Password>",	      //e.g. Test12345
	ca: CaFile,
	clean: true
};

const client = mqtt.connect("mqtts://mqtt.thingsup.io", options);

client.on("connect", function() {
	console.log("connected " + client.connected);
});

client.on("error", function(error) {
	console.log("Can't connect "+error);
});

const topic = "/<AccountID>/bedroom"
const pubOptions = {
	qos: 0
};

const timer_id = setInterval(function() {
	publish(topic, options);
}, 5000);

function publish(topic, options) {
	console.log("publishing message");
	if (client.connected == true) {
		sensor.read(11, 4, function(err, temperature, humidity) {
		if(!err) {
		console.log(`temperature: ${temperature}C, humidity: ${humidity}%`);
		const data = JSON.stringify({temp: temperature, humi: humidity});
		client.publish(topic, data, pubOptions);
		}
		});
	}
}
