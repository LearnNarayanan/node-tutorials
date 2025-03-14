const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  });
};

exports.getIndex = (req, res, next) => {
	Product.fetchAll(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  });
};

exports.getCart = (req, res, next) => {
  // Cart.getCart(cart => {
  //   Product.fetchAll(products => {
  //     const cartProducts = [];
  //     for (product of products) {
  //       const cartProductData = cart.products.find(
  //         prod => prod._id === product._id
  //       );
  //       if (cartProductData) {
  //         cartProducts.push({ productData: product, qty: cartProductData.qty });
  //       }
  //     }
  //     res.render('shop/cart', {
  //       path: '/cart',
  //       pageTitle: 'Your Cart',
  //       products: cartProducts
  //     });
  //   });
  // });
 req.user.getCart()
 .then(productsInCart => {
    res.render('shop/cart', {
      products: productsInCart,
      pageTitle: 'Your Cart',
      path: '/cart'
    });
  });
};

exports.postCart = (req, res, next) => {
	const prodId = req.body.productId;
	Product.fetchProductById(prodId, product => {
    req.user.addToCart(product)
    .then(res.redirect('/cart'));
	});
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.deleteItemFromCart(prodId)
  .then(res.redirect('/cart'));
};

exports.postOrder = (req, res, next) => {
  req.user.addOrder()
  .then((orders)=> {
    res.redirect('/orders'), {
      orders: orders,
      path: '/orders',
      title: 'Your Orders'
    }
  });
}

exports.getOrders = (req, res, next) => {
  req.user.getOrders().
  then(orders => {
    res.render('shop/orders', {
      orders: orders,
      path: '/orders',
      pageTitle: 'Your Orders'
    });
  }
  );
};

exports.getCheckout = (req, res, next) => {
	res.render('shop/checkout', {
		path: '/checkout',
		pageTitle: 'Checkout'
	});
}

exports.getProductDetails = (req, res, next) => {
	const prodId = req.params.productId;
	Product.fetchProductById(prodId, (product) => {
		res.render('shop/product-detail', {
			product: product,
			pageTitle: product.title,
			path: '/products'
		});
	});
}