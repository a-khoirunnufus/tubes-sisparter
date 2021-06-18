const Kafka = require('node-rdkafka');
const { taskType } = require('../eventType.js');

const producer = new Kafka.Producer({
  'bootstrap.servers': 'pkc-ldvr1.asia-southeast1.gcp.confluent.cloud:9092',
  'sasl.username': 'V75LIXGWK53RNSV4',
  'sasl.password': 'PTNeOfbEq5eDiLqEdTfezSfrUpaf3K9SwqfczXDrzG+W11/DHlj+y+86pyJHaWqP',
  'security.protocol': 'SASL_SSL',
  'sasl.mechanisms': 'PLAIN',
  'dr_cb': true
});

const topicName = 'new-task';

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

const messages = [
  {
    task: 'password_cracking',
    params: ['AB87D24BDC7452E55738DEB5F868E1F16DEA5ACE'],
    message: 'convert this raw sha1 password hash to real password'
  },
  {
    task: 'dos_attack',
    params: ['1.9.255.106', '10', '10'],
    message: 'do dos attack to this ip address'
  },
  // {
  //   task: 'password_cracking',
  //   params: ['EC4EA9CABC2595D3D625FEF99BA7C32E9A83EC77'],
  //   message: 'convert this raw sha1 password hash to real password'
  // },
  // {
  //   task: 'dos_attack',
  //   params: ['1.9.255.106', '10', '10'],
  //   message: 'do dos attack to this ip address'
  // }
];

//Wait for the ready event before producing
producer.on('ready', function(arg) {
  console.log('producer ready. ' + JSON.stringify(arg));

  messages.forEach((item, index) => {
    var partition = -1;
    var value = taskType.toBuffer(item);
    var key = Math.floor((Math.random() * 10));

    producer.produce(
      topicName, 
      partition, 
      value,
      key
    );
    console.log(`producing message with key: ${key}`);
  })

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