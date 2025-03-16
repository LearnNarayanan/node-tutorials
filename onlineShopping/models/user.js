const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
	username: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	cart: {
		items: [
			{
				productId: { type: schema.Types.ObjectId, ref: 'Product', required: true },
				quantity: { type: Number, required: true }
			}
		]
	}
});

userSchema.methods.addToCart = function(product) {
	const cartProductIndex = this.cart.items.findIndex(cp => {
		return cp.productId.toString() === product._id.toString();
	});

	let updatedCartItems = [...this.cart.items];

	if (cartProductIndex != -1) {
		updatedCartItems[cartProductIndex].quantity += 1;
	}
	else {
		updatedCartItems.push({ productId: product._id, quantity: 1 });
		this.cart.items = updatedCartItems;
	}
	
	return this.save();
}

userSchema.methods.clearCart = function() {
	this.cart = { items: [] };
	return this.save();
}

userSchema.methods.deleteItemFromCart = function(productId) {
	const updatedCartItems = this.cart.items.filter(item => {
		return item.productId.toString() !== productId.toString();
	});

	this.cart.items = updatedCartItems;

	return this.save();
}

userSchema.methods.getCart = function() {
	return this.populate('cart.items.productId');
}

module.exports = mongoose.model('User', userSchema);