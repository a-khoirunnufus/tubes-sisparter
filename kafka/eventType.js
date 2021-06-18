const avro = require('avsc');

exports.taskType = avro.Type.forSchema({
	type: 'record',
	fields: [
		{ name: 'task', type: 'string' },
		{ name: 'params', type: { type: 'array', items: 'string' } },
		{ name: 'message', type: 'string' }
	]
});

exports.completedTaskType = avro.Type.forSchema({
	type: 'record',
	fields: [
		{ name: 'task', type: 'string' },
		{ name: 'client_ip', type: 'string' },
		{ name: 'payload', type: { type: 'array', items: 'string' } },
		{ name: 'message', type: 'string' }
	]
});