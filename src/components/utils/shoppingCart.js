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
    _addItem(typeWrap(type), ShopCart(shop), CartGood(good))
  }
  this.removeItem = function({ type, shop, good }) {
    _removeItem(typeWrap(type), ShopCart(shop), CartGood(good))
  }
  this.getGoodNumber = function({ type, shop, good }) {
    return _getGoodNumber(typeWrap(type), ShopCart(shop), CartGood(good))
  }
  this.getTypeCart = function({ type }) {
    return _getTypeCart(typeWrap(type))
  }
  this.getTypeCartNumber = function({ type }) {
    return _getTypeCartNumber(typeWrap(type))
  }
  this.getTypeCartMoney = function({ type }) {
    return _getTypeCartMoney(typeWrap(type))
  }
  this.getTypeCartProductList = function({ type }) {
    return _getTypeCartProductList(typeWrap(type))
  }
  this.checkGood = function({ type, shop, good }) {
    _checkGood(typeWrap(type), ShopCart(shop), CartGood(good))
  }
  this.checkShop = function({ type, shop }) {
    _checkShop(typeWrap(type), ShopCart(shop))
  }
  this.checkAll = function({ type }) {
    _checkAll(typeWrap(type))
  }
  this.isAllCartChecked = function({ type }) {
    return _isAllCartChecked(typeWrap(type))
  }
  this.cleanCart = function({ type }) {
    _cleanCart(typeWrap(type))
  }

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
      let goodIndex = _.findIndex(_cart.shopCart[shopIndex].productsList, {
        'productId': cartGood.productId,
        'cupId': cartGood.cupId,
        'temperatureId': cartGood.temperatureId
      });
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
    let goodIndex = _.findIndex(_cart.shopCart[shopIndex].productsList, {
      'productId': cartGood.productId,
      'cupId': cartGood.cupId,
      'temperatureId': cartGood.temperatureId
    });
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
      return 0;
    }

    let goodIndex = _.findIndex(_cart[shopIndex].productsList, {
      'productId': cartGood.productId,
      'cupId': cartGood.cupId,
      'temperatureId': cartGood.temperatureId
    });
    if (goodIndex < 0) {
      return 0;
    }

    return _cart[shopIndex].productsList[goodIndex].productQuantity;
  }

  function _getTypeCart(type) {
    let _cart = carts[type];
    return _cart.shopCart;
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
      'cupId': good.cupId,
      'temperatureId': good.temperatureId,
      'productMonthSaleVolume': good.productMonthSaleVolume,
      'productQuantity': 0, //该商品的数量
      'isChecked': true
    }
    return cartGood;
  }

  function typeWrap(type) {
    return type === 'coffee' ? 'fruit' : type
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
