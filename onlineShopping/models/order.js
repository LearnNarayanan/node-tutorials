const mongoose = require('mongoose');
const schema = mongoose.Schema;

const orderSchema = new schema({
	userId: {
		type: schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	products: [
		{
			product: { type: Object, required: true },
			quantity: { type: Number, required: true }
		}
	]
});

module.exports = mongoose.model('Order', orderSchema);