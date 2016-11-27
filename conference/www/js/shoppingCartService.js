angular.module('starter.services')

.service('ShoppingCart', function($rootScope) {
  var stroage = {
    'furit': 'UxuanShoppingCart',
    'wash': 'washShoppingCart'
  };
  // 所有商家的购物车，即整个购物车的集合
  var furitCart = {
    number: 0,
    money: 0,
    isGetThroesold: false,
    cart: JSON.parse(localStorage.getItem('UxuanShoppingCart')) || []
  }
  var washCart = {
    number: 0,
    money: 0,
    isGetThroesold: false,
    cart: JSON.parse(localStorage.getItem('washShoppingCart')) || []
  }
  var totalCart = {
    furit: furitCart,
    wash: washCart
  }

  // 一个商家的购物车
  function toShopCart(shop) {
    var shopCart = {
      'shopId': shop.shopId,
      'shopInfo': {
        shopName: shop.shopName,
        shopPicUrl: shop.shopHeadImg,
        sendPrice: shop.shopDeliveryFee,
        sendStartPrice: shop.shopStartMoney
      },
      'singleCartTotalNumber': 0,
      'isChecked': true,
      'number': 0, //购物车内所有商品的数量
      'productsList': [] //goods in this shopCart
    }
    return shopCart;
  }

  function toCartGood(good) {
    var cartGood = {
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

  this.getCart = function(type) {
    var type = type || 'furit';
    var _cart = totalCart[type].cart;
    return _cart;
  }
  this.add = function(event, good, shop, type) {
    var type = type || 'furit';
    var _cart = totalCart[type].cart;
    cartFly(event);
    var shopIndex = _.findIndex(_cart, { 'shopId': shop.shopId });
    var cartGood = toCartGood(good);
    var shopCart = toShopCart(shop);
    // 商店购物车第一次被添加
    if (shopIndex < 0) {
      cartGood.productQuantity = 1;
      shopCart.number = 1;
      shopCart.productsList = [cartGood];
      _cart.push(shopCart);
    } else {
      var goodIndex = _.findIndex(_cart[shopIndex].productsList, { 'productId': good.productId });
      // 商品第一次被添加
      if (goodIndex < 0) {
        cartGood.productQuantity = 1;
        _cart[shopIndex].number++;
        _cart[shopIndex].productsList.push(cartGood);
      } else {
        // 商品第二次被添加
        _cart[shopIndex].productsList[goodIndex].productQuantity++;
        _cart[shopIndex].number++;
      }
    }
    totalCart[type].number++;
    $rootScope.$broadcast('cartChange');
    calculateMoney(type);
  }

  this.remove = function(good, shop, type) {
    var type = type || 'furit';
    var _cart = totalCart[type].cart;
    var shopIndex = _.findIndex(_cart, { 'shopId': shop.shopId });
    if (shopIndex < 0) {
      return;
    }
    var goodIndex = _.findIndex(_cart[shopIndex].productsList, { 'productId': good.productId });
    if (goodIndex < 0) {
      return;
    }
    var cartGood = toCartGood(good);
    var shopCart = toShopCart(shop);
    var tempNumber = --_cart[shopIndex].productsList[goodIndex].productQuantity;
    _cart[shopIndex].number--;
    totalCart[type].number--;
    if (tempNumber == 0) {
      _cart[shopIndex].productsList.splice(goodIndex, 1);
      if (_cart[shopIndex].productsList.length == 0) {
        _cart.splice(shopIndex, 1);
      }
    }
    $rootScope.$broadcast('cartChange');
    calculateMoney(type);
  }

  this.getTotalCartNumber = function(type) {
    var type = type || 'furit';
    return totalCart[type].number;
  }

  this.getTotalCartMoney = function(type) {
    var type = type || 'furit';
    var _cart = totalCart[type].cart;
    calculateMoney(type);
    return _cart.money;
  }

  this.getGoodNumber = function(good, shop, type) {
    var type = type || 'furit';
    var _cart = totalCart[type].cart;
    var shopIndex = _.findIndex(_cart, { 'shopId': shop.shopId });
    if (shopIndex < 0) {
      return 0;
    } else {
      var goodIndex = _.findIndex(_cart[shopIndex].productsList, { 'productId': good.productId });
      return goodIndex < 0 ? 0 : _cart[shopIndex].productsList[goodIndex].productQuantity;
    }
  }

  this.getshopCartNumber = function(shopId, type) {
    var type = type || 'furit';
    var _cart = totalCart[type].cart;
    var shopIndex = _.findIndex(_cart, { 'shopId': shopId });
    if (shopIndex < 0) {
      return 0;
    } else {
      return _cart[shopIndex].number;
    }
  }

  this.getshopProductList = function(shopId, type) {
    var type = type || 'furit';
    var _cart = totalCart[type].cart;
    var shopIndex = _.findIndex(_cart, { 'shopId': shopId });
    return _cart[shopIndex].productsList;
  }

  this.isGetThroesold = function() {
    var type = type || 'furit';
    var _cart = totalCart[type].cart;
    _cart.isGetThroesold = true;
    if (_cart.money > 0) {
      $.each(_cart, function(index, shopCart) {
        // 如果选择了，却为达到起送价
        if (shopCart.isChecked == true && shopCart.isReachStartPrice == false) {
          _cart.isGetThroesold = false;
        }
      });
    }
    return _cart.isGetThroesold;
  }

  this.checkShop = function(shop, type) {
    var type = type || 'furit';
    var _cart = totalCart[type].cart;
    var shopIndex = _.findIndex(_cart, { 'shopId': shop.shopId });
    $.each(_cart[shopIndex].productsList, function(index, value) {
      value.isChecked = _cart[shopIndex].isChecked;
    });
    calculateMoney(type);
  }

  this.checkAll = function(isAllChecked, type) {
    var type = type || 'furit';
    var _cart = totalCart[type].cart;
    $.each(_cart, function(index, el) {
      el.isChecked = isAllChecked;
      $.each(el.productsList, function(index, value) {
        value.isChecked = isAllChecked;
      });
    });
    calculateMoney(type);
  }

  this.checkShopGood = function() {
    calculateMoney(type);
  }

  this.cleanCart = function(type) {
    var type = type || 'furit';
    var _cart = totalCart[type].cart;
    for (var i = _cart.length - 1; i >= 0; i--) {
      if (_cart[i]) {
        if (_cart[i].isChecked) {
          _cart.splice(i, 1);
        } else {
          for (var j = _cart[i].productsList.length - 1; j >= 0; j--) {
            if (_cart[i].productsList[j] && _cart[i].productsList[j].isChecked) {
              _cart[i].productsList.splice(j, 1);
            }
          }
        }
      }
    }
    localStorage.setItem(stroage[type], JSON.stringify(_cart));
  }

  function calculateMoney(type) {
    var type = type || 'furit';
    var _cart = totalCart[type].cart;
    _cart.money = 0;
    $.each(_cart, function(index, shopCart) {
      var tempTotalMoney = 0;
      $.each(shopCart.productsList, function(index, value) {
        if (value.isChecked) {
          tempTotalMoney += value.productPrice * value.productQuantity;
        }
      });
      shopCart.singleCartTotalNumber = tempTotalMoney;
      // 是否计算运费
      if (tempTotalMoney > 0) {
        shopCart.singleCartTotalNumber += shopCart.shopInfo.sendPrice * 100;
      }
      // 是否达到起送价
      if (shopCart.singleCartTotalNumber <= shopCart.shopInfo.sendStartPrice * 100) {
        shopCart.isReachStartPrice = false;
      } else {
        shopCart.isReachStartPrice = true;
      }
      _cart.money += shopCart.singleCartTotalNumber;
    });
    localStorage.setItem(stroage[type], JSON.stringify(_cart));
  }

  function cartFly(event) {
    if ($(".icon-cart:visible").length < 1) {
      return;
    }
    var offset = $(".icon-cart:visible").offset();
    var flyer = $('<i class="u-flyer icon ion-ios-color-filter"><i/>');
    flyer.fly({
      start: {
        left: event.pageX,
        top: event.pageY
      },
      end: {
        left: offset.left + 50,
        top: offset.top + 20,
        width: 0,
        height: 0
      },
      onEnd: function() {
        this.destory();
      }
    });
  }

})

.service('orderStatus', function() {
  var status = '';
  this.ordered = function() {
    stauts = 'ordered';
  }
  this.paied = function() {
    stauts = 'paied';
  }
  this.failed = function() {
    stauts = 'failed';
  }
  this.get = function() {
    return stauts;
  }
})

//     orderRequestObj = {
//       url: 'http://www.lifeuxuan.com/backend/api/FruitOrderInsert.php',
//       data: {
//         'longitude': user.longitude,
//         'latitude': user.latitude,
//         // 'orderTime': moment,
//         'userId': user.userId || '1',
//         'userPhoneNumber': $scope.order.receiverPhone + "",
//         'userAddress': $scope.order.receiverAddress,
//         'userPreferTime': $scope.userPreferTime.value,
//         'eguardId': $scope.order.guard + "",
//         'isPaid': true,
//         'totalCartMoney': $scope.carts.allGoodsTotalMoney,
//         'note': $scope.order.note || "无" + "",
//         'productList': cleanedCarts,
//         // 'username': user.user.name || ''
//         'username': user.name
//       }
//     };
//     $.ajax(orderRequestObj)
//       .done(function(e) {
//         var data = JSON.parse(e);
//         console.log(data.message);
//         $scope.$apply(function() {
//           if (data.code != -1) {
//             ForwardPay();
//             orderIds = data.data;
//             console.log('data', data);
//           } else {
//             orderStatus.failed();
//             $state.go('app.orders');
//           }
//         })
//       })
//       .fail(function(e) {
//         console.log(e);
//         console.log("error");
//       })
//       .always(function() {
//         console.log("complete");
//       });

//     function ForwardPay() {

//       $.ajax({
//           url: 'http://www.lifeuxuan.com/backend/wxpay/pay/WxPayCtrl.php',
//           type: 'GET',
//           dataType: 'json',
//           data: {
//             //'openId': 'oDHyIvznjdxR2KFmyAjWMs2S0lyU',
//             // 'payMoney': $scope.carts.allGoodsTotalMoney
//             'payMoney': '1'
//           }
//         })
//         .done(function(e) {
//           // cleanCart();
//           // alert(e);
//           wx.ready(function() {
//             // alert(e);
//             wx.chooseWXPay({
//               timestamp: e.timeStamp,
//               nonceStr: e.nonceStr,
//               package: e.package,
//               signType: e.signType,
//               paySign: e.paySign,
//               success: function(res) {
//                 orderStatus.paied();
//                 console.log('paied success');
//                 console.log('111 orderIds', orderIds);
//                 console.log('111 orderIds is Array', Array.isArray(orderIds));
//                 PayConfirm.get({
//                   'longitude': user.longitude,
//                   'latitude': user.latitude,
//                   'orderId\[\]': orderIds
//                 }, function(data) {
//                   console.log('pay PayConfirm');
//                   $state.go('app.orders');
//                 });
//               },
//               cancel: function(res) {
//                 orderStatus.ordered();
//                 console.log('ordered success');
//                 $state.go('app.orders');
//               },
//               complete: function(res) {
//                 cleanCart();
//               }

//             });
//           });

//         })
//         .fail(function(e) {})
//         .always(function() {});
//     };

//     // $state.go('app.orders');
//   }
