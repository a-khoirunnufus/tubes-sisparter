const Kafka = require('node-rdkafka');
const { completedTaskType } = require('../eventType.js');


const consumer = new Kafka.KafkaConsumer({
  'bootstrap.servers': 'pkc-ldvr1.asia-southeast1.gcp.confluent.cloud:9092',
  'sasl.username': 'V75LIXGWK53RNSV4',
  'sasl.password': 'PTNeOfbEq5eDiLqEdTfezSfrUpaf3K9SwqfczXDrzG+W11/DHlj+y+86pyJHaWqP',
  'security.protocol': 'SASL_SSL',
  'sasl.mechanisms': 'PLAIN',
  'group.id': 'group-1',
  'enable.auto.commit': true
});

var topicName = 'completed-task';

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


consumer.on('data', function(m) {

  console.log(completedTaskType.fromBuffer(m.value));

});

consumer.on('disconnected', function(arg) {
  console.log('consumer disconnected. ' + JSON.stringify(arg));
});

//starting the consumer
consumer.connect();

//stopping this example after 30s
// setTimeout(function() {
//   consumer.disconnect();
// }, 30000);