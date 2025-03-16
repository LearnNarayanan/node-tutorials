const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
// const mongoConnect = require('./util/database').mongoConnect;

const users = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const User = require('./models/user');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
	users.findById('67d5b6a5c44c5936bb7204fd')
	.then(user => {
		req.user = user;
		// req.user = new User(user.name, user.email, user.cart, user._id);
		next();
	})
	.catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// mongoConnect();
mongoose.connect('mongodb+srv://lakshminarayanang1810:xNghfI2Tmu5BjsgM@clustertutorials.nfc0s.mongodb.net/onlineshopping?retryWrites=true&w=majority&appName=ClusterTutorials')
.then(result => {
	users.findOne()
	.then(user => {
		if (!user) {
			const user = new User({username: 'Aravind', email: 'fasdf@gmail.com'});
			user.save();
		}
	})
	app.listen(3000);
	console.log('DB connected and Server started');
})
.catch(err => console.log(err));