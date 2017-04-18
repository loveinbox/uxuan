angular.module('starter.services')

/*
 * typeCart:{
 * shopCart:[{
 *     shopId:123,
 *     goodCart:[]
 *   }]
 * }
 */

.service('ShoppingCart', function($rootScope, CartStore) {
  let carts = CartStore.getCarts()

  this.addItem = function({ type, shop, good }) {
    _addItem(typeWrap(type), ShopCartItem(shop), CartGoodItem(good))
  }
  this.removeItem = function({ type, shop, good }) {
    _removeItem(typeWrap(type), ShopCartItem(shop), CartGoodItem(good))
  }
  this.getGoodNumber = function({ type, shop, good }) {
    return _getGoodNumber(typeWrap(type), ShopCartItem(shop), CartGoodItem(good))
  }
  this.getTypeCart = function({ type }) {
    return _getTypeCart(typeWrap(type))
  }
  this.getTypeCartNumber = function({ type }) {
    return _getTypeCartNumber(typeWrap(type))
  }
  this.getShopCartProductsList = function({ type, shop }) {
    return _getShopCartProductsList(typeWrap(type), ShopCartItem(shop))
  }
  this.checkGood = function({ type, shop, good }) {
    _checkGood(typeWrap(type), ShopCartItem(shop), CartGoodItem(good))
  }
  this.checkShop = function({ type, shop }) {
    _checkShop(typeWrap(type), ShopCartItem(shop))
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

  function _addItem(type, shopCartItem, cartGoodItem) {
    let _cart = carts[type]
    let shopIndex = _.findIndex(_cart.shopCart, { 'shopId': shopCartItem.shopId });
    // 商店购物车第一次被添加
    if (shopIndex < 0) {
      cartGoodItem.productQuantity = 1;
      shopCartItem.number = 1;
      shopCartItem.productsList = [cartGoodItem];
      _cart.number = 1;
      _cart.shopCart.push(shopCartItem);
    } else {
      // 商店购物车第二次被添加
      let goodIndex = _.findIndex(_cart.shopCart[shopIndex].productsList, testCartGood(cartGoodItem));
      // 商品第一次被添加
      if (goodIndex < 0) {
        cartGoodItem.productQuantity = 1;
        _cart.shopCart[shopIndex].number++;
        _cart.shopCart[shopIndex].productsList.push(cartGoodItem);
      } else {
        // 商品第二次被添加
        _cart.shopCart[shopIndex].productsList[goodIndex].productQuantity++;
        _cart.shopCart[shopIndex].number++;
      }
      _cart.number++
    }
    _cartChange(type, _cart)
  }

  function _removeItem(type, shopCartItem, cartGoodItem) {
    let _cart = carts[type];
    let shopIndex = _.findIndex(_cart.shopCart, { 'shopId': shopCartItem.shopId });
    if (shopIndex < 0) {
      return;
    }
    let goodIndex = _.findIndex(_cart.shopCart[shopIndex].productsList, testCartGood(cartGoodItem));
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

  function _getGoodNumber(type, shopCartItem, cartGoodItem) {
    let _shopCart = carts[type].shopCart;
    let shopIndex = _.findIndex(_shopCart, { 'shopId': shopCartItem.shopId });
    if (shopIndex < 0) {
      return 0;
    }
    let goodIndex = _.findIndex(_shopCart[shopIndex].productsList, testCartGood(cartGoodItem));
    if (goodIndex < 0) {
      return 0;
    }

    return _shopCart[shopIndex].productsList[goodIndex].productQuantity;
  }

  function _getTypeCart(type) {
    let _cart = carts[type];
    return _cart.shopCart;
  }

  function _getTypeCartNumber(type) {
    let _cart = carts[type];
    return _cart.number;
  }

  function _getShopCartProductsList(type, shopCartItem) {
    let _shopCart = carts[type].shopCart;
    let shopIndex = _.findIndex(_shopCart, { 'shopId': shopCartItem.shopId });
    if (shopIndex < 0) {
      return 0;
    }
    return _shopCart[shopIndex].productsList;
  }

  function _checkGood(type, shopCartItem, cartGoodItem) {
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
    // let _shopCart = carts[type].shopCart;
    // _cartChange(type, _cart)
  }

  function _cartChange(type, cart) {
    CartStore.saveCart(type, cart)
    $rootScope.$broadcast('cartChange');
  }

  // 一个商家的购物车
  function ShopCartItem(shop) {
    if (!shop) {
      return shop
    }
    let shopCartItem = {
      'shopId': shop.shopId,
      'shopName': shop.shopName,
      'shopHeadImg': shop.shopHeadImg,
      'shopDeliveryFee': shop.shopDeliveryFee,
      'shopStartMoney': shop.shopStartMoney,
      'shopFreeDeliveryMoney': shop.shopFreeDeliveryMoney,
      'isChecked': true,
      'number': 0, //购物车内所有商品的数量
      'productsList': [] //goods in this shopCart
    }
    return shopCartItem;
  }

  function CartGoodItem(good) {
    if (!good) {
      return good
    }
    let cartGoodItem = {
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
    if (good.cupId) {
      cartGoodItem.cupId = good.cupId
    }
    if (good.temperatureId) {
      cartGoodItem.temperatureId = good.temperatureId
    }
    return cartGoodItem;
  }

  function testCartGood(cartGoodItem) {
    let _cartGood = {
      'productId': cartGoodItem.productId,
    }
    if (cartGoodItem.cupId) {
      _cartGood.cupId = cartGoodItem.cupId
    }
    if (cartGoodItem.temperatureId) {
      _cartGood.temperatureId = cartGoodItem.temperatureId
    }
    return _cartGood
  }

  function typeWrap(type) {
    return type === 'coffee' ? 'fruit' : type
  }

  this.utils = {
    ShopCartItem,
    CartGoodItem,
    testCartGood,
    typeWrap,
  }

})

.service('CartStore', function() {
  const TYPES = ['fruit', 'coffee', 'wash-order']
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
