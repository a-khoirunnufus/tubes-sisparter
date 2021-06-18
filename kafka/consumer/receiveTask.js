const Kafka = require('node-rdkafka');
const { taskType } = require('../eventType.js');
const { exec } = require("child_process");


const consumer = new Kafka.KafkaConsumer({
  'bootstrap.servers': 'pkc-ldvr1.asia-southeast1.gcp.confluent.cloud:9092',
  'sasl.username': 'V75LIXGWK53RNSV4',
  'sasl.password': 'PTNeOfbEq5eDiLqEdTfezSfrUpaf3K9SwqfczXDrzG+W11/DHlj+y+86pyJHaWqP',
  'security.protocol': 'SASL_SSL',
  'sasl.mechanisms': 'PLAIN',
  'group.id': 'group-1',
  'enable.auto.commit': true
});

var topicName = 'new-task';

//logging debug messages, if debug is enabled
consumer.on('event.log', function(log) {
  console.log(log);
});

//logging all errors
consumer.on('event.error', function(err) {
  console.error('Error from consumer');
  console.error(err);
});

consumer.on('ready', function(arg) {
  console.log('consumer ready. ' + JSON.stringify(arg));

  consumer.subscribe([topicName]);
  //start consuming messages
  consumer.consume();
});

let task = [];

consumer.on('data', function(m) {
  let recv = taskType.fromBuffer(m.value);
  task.push(recv)
  console.log('Received Task: ', recv);

});

consumer.on('disconnected', function(arg) {
  console.log('consumer disconnected. ' + JSON.stringify(arg));
});

//starting the consumer
consumer.connect();

// stopping this example after 30s
setTimeout(function() {
  consumer.disconnect();
}, 30000);

setTimeout(function() {
  task.forEach((item) => {
    switch(item.task) {
      case 'password_cracking':
        console.log('Performing password cracking...');
        exec(`python3 ./password-cracker/main.py ${item.params[0]}`, (error, stdout, stderr) => {
          console.log(`${stdout}`);
        });
        break;
      case 'dos_attack':
        console.log('Performing dos attack...');
        exec(`python3 ./dos-attack/main.py ${item.params[0]} ${item.params[1]} ${item.params[2]}`, (error, stdout, stderr) => {
          console.log(`${stdout}`);
        });
        break;
      default:
    }
  })
}, 31000);