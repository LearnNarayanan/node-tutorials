const mongoose = require('mongoose');
const schema = mongoose.Schema;

const productSchema = new schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

// Mongoose will automatically convert the model name 'Product' to 'products' and create a collection in the database.
// If you want to specify the collection name, you can do so by passing the collection name as the second argument to mongoose.model().
module.exports = mongoose.model('Product', productSchema);