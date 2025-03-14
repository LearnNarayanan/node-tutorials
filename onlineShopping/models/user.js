const getDb = require('../util/database').getDb;
const ObjectId = require('mongodb').ObjectId;

module.exports = class User {
	constructor(username, email, cart, id) {
		this.username = username;
		this.email = email;
		this.cart = cart;
		this.id = id;
	}
	
	save() {
		const db = getDb();
		return db.collection('Users').insertOne(this);
	}
	
	static findUserById(userId) {
		const db = getDb();
		return db.collection('Users').findOne({ _id: new ObjectId(userId) });
	};

	addToCart(product) {
		const cartProductIndex = this.cart.items.findIndex(cp => {
			return cp.productId.toString() === product._id.toString();
		});

		let updatedCartItems = [...this.cart.items];

		if (cartProductIndex != -1) {
			updatedCartItems[cartProductIndex].quantity += 1;
		}
		else {
			updatedCartItems.push({ productId: new ObjectId(product._id), quantity: 1 });
			this.cart.items = updatedCartItems;
		}
		
		const db = getDb();
		return db.collection('Users').updateOne(
			{ _id: new ObjectId(this.id) },
			{ $set: { cart: this.cart } }
		);
	}

	getCart() {
		const db = getDb();
		const productIds = this.cart.items.map(i => {
			return i.productId;
		});

		return db.collection("Products").find({ _id: { $in: productIds } }).toArray()
		.then(products => {
			return products.map(p => {
				return {
					...p,
					quantity: this.cart.items.find(i => {
						return i.productId.toString() === p._id.toString();
					}).quantity
				};
			});	
		});
	}

	deleteItemFromCart(productId) {
		const updatedCartItems = this.cart.items.filter(item => {
			return item.productId.toString() !== productId.toString();
		});

		const db = getDb();
		return db.collection('Users').updateOne(
			{ _id: new ObjectId(this.id) },
			{ $set: { cart: { items: updatedCartItems } } }
		);
	}
	
	addOrder() {
		const db = getDb();
		return this.getCart()
				.then((products) => {
					return db.collection("Orders").insertOne({userId: this.id, items: products})
					.then(() => {
						this.cart = {items: []};
						return db.collection("Users").updateOne(
							{ _id: new ObjectId(this.id) },
							{ $set: { cart: { items: [] } } }
						);
					})
				});
	}

	getOrders() {
		const db = getDb();
		return db.collection("Orders").find({'userId': this.id}).toArray()
		.then(orders => {
			return orders;
		});
	}
};