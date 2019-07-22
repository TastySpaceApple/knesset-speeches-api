const path = require('path');
const fs = require('fs');
const express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors');

let app = express();

app.use(express.static(__dirname + '/examples'));

app.use(cors({ allowedHeaders: 'Content-Type, Cache-Control' }));
app.options('*', cors());  // enable pre-flight

app.use(bodyParser.json({ limit: '50mb' }));

let open_speeches_db_why_did_i_have_to_create_one_myself_this_is_ridiculous = require('./services/open-knesset-speeches-db.js');

app.post('/add_to_database', (req, res) => {
	let data = req.body;
	console.log("########## UPDATE DATABASE REQUEST ##########");
	console.log("Speeches: " + data.speeches.length)
	console.log("Subjects: " + data.subjects.length)
	console.log("Assembly: ");
	console.log(JSON.stringify(data.assembly, null, 4));
	let protocolId = data.protocolId;

	let operations = [
	open_speeches_db_why_did_i_have_to_create_one_myself_this_is_ridiculous.addSpeechesFromAssembly(protocolId, data.speeches),
	open_speeches_db_why_did_i_have_to_create_one_myself_this_is_ridiculous.addSubjectsFromAssembly(protocolId, data.subjects),
	open_speeches_db_why_did_i_have_to_create_one_myself_this_is_ridiculous.updateAssemblyDetails(protocolId, data.assembly) ]

	Promise.all(operations).then(() => {
		res.send('OK')
	});
})

app.use('/api', require('./api/router'))

app.listen(process.env.PORT || 3000);

module.exports = app;
