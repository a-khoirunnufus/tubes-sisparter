const Kafka = require('node-rdkafka');
const { completedTaskType } = require('../eventType.js');
const argv = require('minimist')(process.argv.slice(2));

const producer = new Kafka.Producer({
  'bootstrap.servers': 'pkc-ldvr1.asia-southeast1.gcp.confluent.cloud:9092',
  'sasl.username': 'V75LIXGWK53RNSV4',
  'sasl.password': 'PTNeOfbEq5eDiLqEdTfezSfrUpaf3K9SwqfczXDrzG+W11/DHlj+y+86pyJHaWqP',
  'security.protocol': 'SASL_SSL',
  'sasl.mechanisms': 'PLAIN',
  'dr_cb': true
});

const topicName = 'completed-task';

//logging debug messages, if debug is enabled
producer.on('event.log', function(log) {
  console.log(log);
});

//logging all errors
producer.on('event.error', function(err) {
  console.error('Error from producer');
  console.error(err);
});


producer.on('delivery-report', function(err, report) {
  if (err) {
    console.warn('Error producing', err)
  } else {
    const {topic, partition, value} = report;
    console.log(`Successfully produced record to topic "${topic}" partition ${partition}`);
  }
});


//Wait for the ready event before producing
producer.on('ready', function(arg) {
  console.log('producer ready. ' + JSON.stringify(arg));

  var partition = -1;
  
  const message = {
    task: argv.task,
    client_ip: argv.client_ip,
    payload: argv._,
    message: argv.msg
  };

  // console.log(message);

  var value = completedTaskType.toBuffer(message);
  var key = 'key-6';

  producer.produce(
    topicName, 
    partition, 
    value,
    key
  );
  console.log(`producing message with key: ${key}`);

  producer.poll();

  producer.flush(10000, () => {
    producer.disconnect();
  });

});

producer.on('disconnected', function(arg) {
  console.log('producer disconnected. ' + JSON.stringify(arg));
});

//starting the producer
producer.connect();