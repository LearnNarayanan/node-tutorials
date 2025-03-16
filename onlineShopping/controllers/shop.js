const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
  Product.find()
  .then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  })
};

exports.getIndex = (req, res, next) => {
  Product.find()
  .then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  }
  );
};

exports.getCart = (req, res, next) => {
 req.user.populate('cart.items.productId')
  .then(user  => {
    const productsInCart = user.cart.items;
    console.log(productsInCart);
    res.render('shop/cart', {
      products: productsInCart,
      pageTitle: 'Your Cart',
      path: '/cart'
    });
 })
};

exports.postCart = (req, res, next) => {
	const prodId = req.body.productId;
	Product.findById(prodId)
  .then(product => {
    return req.user.addToCart(product)
  })
  .then(result => {
    console.log(result);
    res.redirect('/cart');
  });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.deleteItemFromCart(prodId)
  .then(res.redirect('/cart'));
};

exports.postOrder = (req, res, next) => {
  req.user.populate('cart.items.productId')
  .then(user  => {
    const productsInCart = user.cart.items;
    console.log(productsInCart);
    const products = productsInCart.map(i => {
      return { quantity: i.quantity, product: { ...i.productId._doc } };
    });
    console.log("after change:" + products)
    const newOrder = new Order({
      userId: req.user,
      products: products
    });
    return newOrder.save();
  })
  .then(result => {
    return req.user.clearCart();
  })
  .then(()=> {
    res.redirect('/orders')
  });
}

exports.getOrders = (req, res, next) => {
  Order.find({userId: req.user})
  .then(orders => {
    console.log(orders);
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
    const productId = req.params.productId;
    Product.findById(productId)
    .then(product => {
        res.render('shop/product-detail', {
            product: product,
            pageTitle: product.title,
            path: '/products'
        });
    });       
};