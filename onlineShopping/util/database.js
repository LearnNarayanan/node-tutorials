const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;

const adminUser = 'lakshminarayanang1810';
const adminPwd = 'xNghfI2Tmu5BjsgM';
const devUser = 'dev-narayanan';
const devPwd = 'vxmdwmeoRzNpZfEd';

let _db;

const url = 'mongodb+srv://' + adminUser + ':' + adminPwd + '@clustertutorials.nfc0s.mongodb.net/?retryWrites=true&w=majority&appName=ClusterTutorials';
const client = new mongoClient(url);

// mongodb+srv://<lakshminarayanang1810>:<xNghfI2Tmu5BjsgM>@clustertutorials.nfc0s.mongodb.net/

mongoConnect = () => {
	client.connect()
	.then(client => {
		console.log('Connected to MongoDB');
		_db = client.db('onlineshopping');
	})
	.catch(err => { 
		console.log(err);
		throw err;
	});
}

getDb = () => {
	if (_db) {
		return _db;
	}
	throw 'No database found';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

