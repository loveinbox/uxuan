angular.module('starter.services')

// typeCart:{
//   shopCart:[{
//     shopId:123,
//     goodCart:[]
//   }]
// }

.service('ShoppingCart', function($rootScope, CartStore) {
  let carts = CartStore.getCarts()

  this.addItem = function({ type, shop, good }) {
    _addItem(type, ShopCart(shop), CartGood(good))
  }
  this.removeItem = function({ type, shop, good }) {
    _removeItem(type, ShopCart(shop), CartGood(good))
  }
  this.getGoodNumber = function({ type, shop, good }) {
    return _getGoodNumber(type, ShopCart(shop), CartGood(good))
  }
  this.getTypeCart = function({ type, shop }) {
    return _getTypeCart(type, ShopCart(shop))
  }
  this.getTypeCartNumber = function({ type }) {
    return _getTypeCartNumber(type)
  }
  this.getTypeCartMoney = function({ type }) {
    return _getTypeCartMoney(type)
  }
  this.getTypeCartProductList = function({ type }) {
    return _getTypeCartProductList(type)
  }
  this.checkGood = function({ type, shop, good }) {
    _checkGood(type, ShopCart(shop), CartGood(good))
  }
  this.checkShop = function({ type, shop }) {
    _checkShop(type, ShopCart(shop))
  }
  this.checkAll = function({ type }) {
    _checkAll(type)
  }
  this.isAllCartChecked = function({ type }) {
    return _isAllCartChecked(type)
  }
  this.cleanCart = function({ type }) {
    _cleanCart(type)
  }

  // let stroage = {
  //   'furit': 'fruitShoppingCart',
  //   'wash': 'washShoppingCart',
  //   'coffee': 'coffeeShoppingCart'
  // };
  // // 所有商家的购物车，即整个购物车的集合
  // let furitCart = {
  //   number: 0,
  //   money: 0,
  //   isGetThroesold: false,
  //   isReachStartPrice: false,
  //   cart: JSON.parse(localStorage.getItem('fruitShoppingCart')) || []
  // }
  // let washCart = {
  //   number: 0,
  //   money: 0,
  //   isGetThroesold: false,
  //   isReachStartPrice: false,
  //   cart: JSON.parse(localStorage.getItem('washShoppingCart')) || []
  // }
  // let coffeeCart = {
  //   number: 0,
  //   money: 0,
  //   isGetThroesold: false,
  //   isReachStartPrice: false,
  //   cart: JSON.parse(localStorage.getItem('coffeeShoppingCart')) || []
  // }
  // let carts = {
  //   furit: furitCart,
  //   wash: washCart,
  //   coffee: coffeeCart
  // }


  function _addItem(type, shopCart, cartGood) {
    let _cart = carts[type]
    let shopIndex = _.findIndex(_cart.shopCart, { 'shopId': shopCart.shopId });
    // 商店购物车第一次被添加
    if (shopIndex < 0) {
      cartGood.productQuantity = 1;
      shopCart.number = 1;
      shopCart.productsList = [cartGood];
      _cart.number = 1;
      _cart.shopCart.push(shopCart);
    } else {
      // 商店购物车第二次被添加
      let goodIndex = _.findIndex(_cart.shopCart[shopIndex].productsList, { 'productId': cartGood.productId });
      // 商品第一次被添加
      if (goodIndex < 0) {
        cartGood.productQuantity = 1;
        _cart.shopCart[shopIndex].number++;
        _cart.shopCart[shopIndex].productsList.push(cartGood);
      } else {
        // 商品第二次被添加
        _cart.shopCart[shopIndex].productsList[goodIndex].productQuantity++;
        _cart.shopCart[shopIndex].number++;
      }
      _cart.number++
    }
    _cartChange(type, _cart)
  }

  function _removeItem(type, shopCart, cartGood) {
    let _cart = carts[type];
    let shopIndex = _.findIndex(_cart.shopCart, { 'shopId': shopCart.shopId });
    if (shopIndex < 0) {
      return;
    }
    let goodIndex = _.findIndex(_cart.shopCart[shopIndex].productsList, { 'productId': cartGood.productId });
    if (goodIndex < 0) {
      return;
    }
    --_cart.number;
    --_cart.shopCart[shopIndex].number;
    let tempNumber = --_cart.shopCart[shopIndex].productsList[goodIndex].productQuantity;
    if (tempNumber === 0) {
      _cart.shopCart[shopIndex].productsList.splice(goodIndex, 1);
      if (_cart.shopCart[shopIndex].productsList.length == 0) {
        _cart.shopCart.splice(shopIndex, 1);
      }
    }
    _cartChange(type, _cart)
  }

  function _getGoodNumber(type, shopCart, cartGood) {
    let _cart = carts[type].shopCart;
    let shopIndex = _.findIndex(_cart, { 'shopId': shopCart.shopId });
    if (shopIndex < 0) {
      return -1;
    }

    let goodIndex = _.findIndex(_cart[shopIndex].productsList, { 'productId': cartGood.productId });
    if (goodIndex < 0) {
      return -1;
    }

    return _cart[shopIndex].productsList[goodIndex].productQuantity;
  }

  function _getShopCart(type, shopCart, cartGood) {

  }

  function _getTypeCartNumber(type) {
    let _cart = carts[type];
    return _cart.number;
  }

  function _getTypeCartMoney(type) {
    let _cart = carts[type].shopCart;
    return calculateMoney(type);
  }

  function _getTypeCartProductList(type) {
    return carts[type].shopCart;
  }

  function _checkGood(type, shopCart, cartGood) {
    _cartChange(type, _cart)
  }

  function _checkShop(type, shop) {
    _cartChange(type, _cart)
  }

  function _checkAll(type) {
    _cartChange(type, _cart)
  }

  function _isAllCartChecked(type) {

  }

  function _cleanCart(type) {
    _cartChange(type, _cart)
  }

  function _cartChange(type, cart) {
    CartStore.saveCart(type, cart)
    $rootScope.$broadcast('cartChange');
  }

  // function _removeItem = function(good, shop, type) {
  //   let type = type || 'furit';
  //   let _cart = carts[type].cart;
  //   let shopIndex = _.findIndex(_cart, { 'shopId': shopCart.shopId });
  //   if (shopIndex < 0) {
  //     return;
  //   }
  //   let goodIndex = _.findIndex(_cart[shopIndex].productsList, { 'productId': good.productId });
  //   if (goodIndex < 0) {
  //     return;
  //   }

  //   let tempNumber = --_cart[shopIndex].productsList[goodIndex].productQuantity;
  //   _cart[shopIndex].number--;
  //   carts[type].number--;
  //   if (tempNumber == 0) {
  //     _cart[shopIndex].productsList.splice(goodIndex, 1);
  //     if (_cart[shopIndex].productsList.length == 0) {
  //       _cart.splice(shopIndex, 1);
  //     }
  //   }
  //   $rootScope.$broadcast('cartChange');
  //   calculateMoney(type);
  // }

  // function _getShopCart = function(type) {
  //   let type = type || 'furit';
  //   let _cart = carts[type].cart;
  //   return _cart;
  // }

  // function _getTotalCartNumber = function(type) {
  //   let type = type || 'furit';
  //   return carts[type].number;
  // }

  // function _getTotalCartMoney = function(type) {
  //   let type = type || 'furit';
  //   let _cart = carts[type].cart;
  //   calculateMoney(type);
  //   return _cart.money;
  // }

  // function _getGoodNumber = function(good, shop, type) {
  //   let type = type || 'furit';
  //   let _cart = carts[type].cart;
  //   let shopIndex = _.findIndex(_cart, { 'shopId': shopCart.shopId });
  //   if (shopIndex < 0) {
  //     return 0;
  //   } else {
  //     let goodIndex = _.findIndex(_cart[shopIndex].productsList, { 'productId': good.productId });
  //     return goodIndex < 0 ? 0 : _cart[shopIndex].productsList[goodIndex].productQuantity;
  //   }
  // }

  // function _getshopCartNumber = function(shopId, type) {
  //   let type = type || 'furit';
  //   let _cart = carts[type].cart;
  //   let shopIndex = _.findIndex(_cart, { 'shopId': shopId });
  //   if (shopIndex < 0) {
  //     return 0;
  //   } else {
  //     return _cart[shopIndex].number;
  //   }
  // }

  // function _getshopCartMoney = function(shopId, type) {
  //   let type = type || 'furit';
  //   let _cart = carts[type].cart;
  //   let shop = _.find(_cart, { 'shopId': shopId });
  //   let tempTotalMoney = 0;
  //   if (!shop) {
  //     return 0;
  //   } else {
  //     $.each(shop.productsList, function(, value) {
  //       tempTotalMoney += value.productPrice * value.productQuantity;
  //     });
  //     return tempTotalMoney;
  //   }
  // }

  // function _getshopProductList = function(shopId, type) {
  //   let type = type || 'furit';
  //   let _cart = carts[type].cart;
  //   let shopIndex = _.findIndex(_cart, { 'shopId': shopId });
  //   return _cart[shopIndex].productsList;
  // }

  // function _isGetThroesold = function(type) {
  //   let type = type || 'furit';
  //   let _cart = carts[type].cart;
  //   _cart.isGetThroesold = true;
  //   if (_cart.length > 0) {
  //     $.each(_cart, function(index, shopCart) {
  //       // 如果选择了，却为达到起送价
  //       if (shopCart.isChecked == true && shopCart.isReachStartPrice == false) {
  //         _cart.isGetThroesold = false;
  //       }
  //     });
  //   }
  //   return _cart.isGetThroesold;
  // }

  // function _isShowReachStartPrice = function(shopId, type) {
  //   let type = type || 'furit';
  //   let _cart = carts[type].cart;
  //   let shopIndex = _.findIndex(_cart, { 'shopId': shopId });
  //   return _cart[shopIndex].isReachStartPrice;
  // }

  // function _checkShop = function(shop, type) {
  //   let type = type || 'furit';
  //   let _cart = carts[type].cart;
  //   let shopIndex = _.findIndex(_cart, { 'shopId': shopCart.shopId });
  //   $.each(_cart[shopIndex].productsList, function(index, value) {
  //     value.isChecked = _cart[shopIndex].isChecked;
  //   });
  //   calculateMoney(type);
  // }

  // function _checkAll = function(isAllChecked, type) {
  //   let type = type || 'furit';
  //   let _cart = carts[type].cart;
  //   $.each(_cart, function(index, el) {
  //     el.isChecked = isAllChecked;
  //     $.each(el.productsList, function(index, value) {
  //       value.isChecked = isAllChecked;
  //     });
  //   });
  //   calculateMoney(type);
  // }

  // function _checkShopGood = function(type, good, shop) {
  //   let type = type || 'furit';
  //   let _cart = carts[type].cart;
  //   let shopIndex = _.findIndex(_cart, { 'shopId': shopCart.shopId });
  //   let isAllChecked = true;
  //   $.each(_cart[shopIndex].productsList, function(index, value) {
  //     if (!value.isChecked) {
  //       isAllChecked = false;
  //     }
  //   });
  //   _cart[shopIndex].isChecked = isAllChecked;
  //   calculateMoney(type);
  // }

  // function _cleanCart = function(type) {
  //   let type = type || 'furit';
  //   let _cart = carts[type].cart;
  //   for (let i = _cart.length - 1; i >= 0; i--) {
  //     if (_cart[i]) {
  //       if (_cart[i].isChecked) {
  //         _cart.splice(i, 1);
  //       } else {
  //         for (let j = _cart[i].productsList.length - 1; j >= 0; j--) {
  //           if (_cart[i].productsList[j] && _cart[i].productsList[j].isChecked) {
  //             _cart[i].productsList.splice(j, 1);
  //           }
  //         }
  //       }
  //     }
  //   }
  //   localStorage.setItem(stroage[type], JSON.stringify(_cart));
  // }

  // 一个商家的购物车
  function ShopCart(shop) {
    let shopCart = {
      'shopId': shop.shopId,
      'shopInfo': {
        shopName: shop.shopName,
        shopPicUrl: shop.shopHeadImg,
        sendPrice: shop.shopDeliveryFee,
        sendStartPrice: shop.shopStartMoney || shop.shopFreeDeliveryMoney
      },
      'singleCartTotalNumber': 0,
      'isChecked': true,
      'number': 0, //购物车内所有商品的数量
      'productsList': [] //goods in this shopCart
    }
    return shopCart;
  }

  function CartGood(good) {
    let cartGood = {
      'productId': good.productId,
      'productName': good.productName,
      'productDescription': good.productDescription,
      'productHeadImg': good.productHeadImg,
      'productClassifyId': good.productClassifyId,
      'productUnit': good.productUnit,
      'productMeasure': good.productMeasure,
      'productPrice': good.productPrice,
      'productMonthSaleVolume': good.productMonthSaleVolume,
      'productQuantity': 0, //该商品的数量
      'isChecked': true
    }
    return cartGood;
  }

  function calculateMoney(type) {
    let _cart = carts[type].shopCart;
    let shopCartMoney = 0;
    _cart.forEach(shopCart => {
      shopCart.productsList.forEach(value => {
        if (value.isChecked) {
          shopCartMoney += value.productPrice * value.productQuantity;
        }
      });
      // shopCart.singleCartTotalNumber = tempTotalMoney;
      // // 是否达到起送价
      // if (shopCart.singleCartTotalNumber < shopCart.shopInfo.sendStartPrice * 100) {
      //   shopCart.isReachStartPrice = false;
      // } else {
      //   shopCart.isReachStartPrice = true;
      // }
      // // 是否计算运费
      // if (tempTotalMoney > 0) {
      //   if (!(type == 'wash' && shopCart.isReachStartPrice))
      //     shopCart.singleCartTotalNumber += shopCart.shopInfo.sendPrice * 100;
      // }
      // money += shopCart.singleCartTotalNumber;
    });
    return shopCartMoney
  }

})

.service('CartStore', function() {
  const TYPES = ['fruit', 'wash', 'coffee']
  let store = JSON.parse(localStorage.getItem('UShoppingCart')) || initStore()
  this.getCarts = function() {
    return store
  }
  this.saveCart = function(type, cart) {
    store[type] = cart
    localStorage.setItem('UShoppingCart', JSON.stringify(store));
  }

  function initStore() {
    let temp = {}
    TYPES.forEach(type => {
      temp[type] = {
        shopCart: []
      }
    })
    return temp
  }
})
