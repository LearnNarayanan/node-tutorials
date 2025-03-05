const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;

const connectedUrl = 'mongodb+srv://lakshminarayanang1810:xNghfI2Tmu5BjsgM>@clustertutorials.nfc0s.mongodb.net/?retryWrites=true&w=majority&appName=ClusterTutorials';
const pwd = 'xNghfI2Tmu5BjsgM';

mongoConnect = (cb) => {
	mongoClient.connect(connectedUrl)
	.then(client => {
		console.log('Connected to MongoDB');
		cb(client);
	})
	.catch(err => { 
		console.log(err)
	});
}

module.exports = mongoConnect;
