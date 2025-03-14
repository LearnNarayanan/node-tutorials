const fs = require('fs');
const path = require('path');

const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;

const Cart = require('./cart');

/* const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
}; */

const getDb = require('../util/database').getDb;

const getProductsFromDB = (cb) => {
    const db = getDb();
    db.collection('Products').find().toArray()
    .then(products => {
      cb (products);
    })
    .catch(err => {
      console.log(err);
    }
    );
}

module.exports = class Product {
  constructor(title, imageUrl, description, price, id, userId) { 
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    id && (this.id = id);
    this.userId = userId;
  }

  /* save() {
    getProductsFromDB(products => {
      if (this.id) {
        const existingProductIndex = products.findIndex(
          prod => prod.id === this.id
        );
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProducts), err => {
          console.log(err);
        });
      } else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), err => {
          console.log(err);
        });
      }
    });
  } */

  save(cb) {
    const db = getDb();
    if (this.id) {
      db.collection('Products').updateOne({ _id: new ObjectId(this.id) }, { $set: this })
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
    }
    else {
      db.collection('Products').insertOne(this)
      .then(result => {
        cb();
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
    }
  }

  // static delete(prodId, cb) {
  //   getProductsFromDB(products => {
  //     const product = products.find(p => p.id === prodId);
  //     const updatedProducts = products.filter(p => p.id !== prodId);
  //     fs.writeFile(p, JSON.stringify(updatedProducts), err => {
  //       if (!err) {
  //         cb();
  //         Cart.deleteProduct(prodId, product.price);
  //       }
  //     });
  //   });
  // }

  static delete (prodId, cb) {
    const db = getDb();
    db.collection('Products').deleteOne({ _id: new ObjectId(prodId) })
    .then(result => {
      console.log('Deleted');
      cb();
    })
    .catch(err => {
      console.log(err);
    });
  }

  static fetchAll(cb) {
    getProductsFromDB(cb);
  }

  // static fetchProductById(prodId, cb) {
  //   getProductsFromDB(products => {
  //     const product = products.find(p => p.id === prodId);
  //     cb(product);
  //   });
  // }

  static fetchProductById(prodId, cb) {
    const db = getDb();
    db.collection('Products').find({ _id: new ObjectId(prodId) }).next()
    .then(product => {
      cb(product);
    })
    .catch(err => {
      console.log(err);
    });
  }
};
