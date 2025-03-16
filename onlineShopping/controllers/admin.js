const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  // Here mongoose can also accept userId field as req.user alone, and not req.user._id, as it will automatically extract the id from the user object.
  const product = new Product({title: title, price: price, description: description, imageUrl: imageUrl, userId: req.user});
  // This save method call is from mongoose and not the save() method exposed in product model class, which was there earlier.
  product.save()
  .then(result => {
    console.log('Product Created');
      res.redirect('/');
  })
  .catch(err => {
      console.log(err);
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  Product.findById(req.params.productId)
  .then(product => {
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  })
};

exports.postDeleteProduct = (req, res, next) => {
 const prodId = req.body.productId;
 Product.findByIdAndDelete(prodId)
 .then(()=> {
  res.redirect('/admin/products');
 });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Product.findById(prodId)
  .then(product => {
    product.title = updatedTitle;
    product.description = updatedDesc;
    product.imageUrl = updatedImageUrl;
    product.price = updatedPrice;

    product.save()
    .then(()=> {
      res.redirect('/admin/products');
    })
  });
};

exports.getProducts = (req, res, next) => {
  Product.find()
  .then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};
