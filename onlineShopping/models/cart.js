const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);

module.exports = class Cart {
 
  static addProduct(id, productPrice) {
   fs.readFile(p, (err, fileContent) => {
	let cart = {products: [], totalPrice:0};

	if (!err) {
		cart = JSON.parse(fileContent);
	}
	
	const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
	const existingProduct = cart.products[existingProductIndex];
	let updatedProduct;
	if (existingProduct) {
		updatedProduct = { ...existingProduct };
		updatedProduct.qty = updatedProduct.qty + 1;
		cart.products[existingProductIndex] = updatedProduct;
	}
	else {
		updatedProduct = {id: id, qty: 1};
		cart.products = [...cart.products, updatedProduct];
	}
	cart.totalPrice = parseFloat(cart.totalPrice) + parseFloat(productPrice);
	fs.writeFile(p, JSON.stringify(cart), err => {
		console.log(err);
	});
  	});
  }

  static deleteProduct(id, productPrice) {
	fs.readFile(p, (err, fileContent) => {
		const cart = JSON.parse(fileContent);
		const updatedCart = {...cart};
		const productIndex = updatedCart.products.findIndex(prod => prod.id === id);
		const product = updatedCart.products[productIndex];
		if (!product) {
			return;
		}

		const productQty = product.qty;
		updatedCart.products.splice(productIndex, 1);
		updatedCart.totalPrice = updatedCart.totalPrice - (productPrice * productQty);
		product.qty = 0;

		fs.writeFile(p, JSON.stringify(updatedCart), err => {
			console.log(err);
		});
	});
  }

  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      if (err) {
        cb(null);
      } else {
        cb(cart);
      }
    });
  }
};
