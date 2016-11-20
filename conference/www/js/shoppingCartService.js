angular.module('starter.services')

.service('ShoppingCart', function($rootScope) {

  // 所有商家的购物车，即整个购物车的集合
  var totalCart = JSON.parse(localStorage.getItem('UxuanShoppingCart')) || [];
  var totalCartNumber = 0;
  var totalCartMoney = 0;
  var isGetThroesold = false;
  // 一个商家的购物车
  function toshopCart(shop) {
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
      'goodsList': [] //goods in this shopCart
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
      'number': 0, //该商品的数量
      'isChecked': true
    }
    return cartGood;
  }

  this.getCart = function() {
    return totalCart;
  }
  this.add = function(event, good, shop) {
    cartFly(event);
    var shopIndex = _.findIndex(totalCart, { 'shopId': shop.shopId });
    var cartGood = toCartGood(good);
    var shopCart = toshopCart(shop);
    // 商店购物车第一次被添加
    if (shopIndex < 0) {
      cartGood.number = 1;
      shopCart.number = 1;
      shopCart.goodsList = [cartGood];
      totalCart.push(shopCart);
      totalCartNumber = 1;
    } else {
      var goodIndex = _.findIndex(totalCart[shopIndex].goodsList, { 'productId': good.productId });
      // 商品第一次被添加
      if (goodIndex < 0) {
        cartGood.number = 1;
        shopCart.number++;
        totalCart[shopIndex].goodsList.push(cartGood);
        totalCartNumber++;
      } else {
        // 商品第二次被添加
        totalCart[shopIndex].goodsList[goodIndex].number++;
        totalCart[shopIndex].number++;
        totalCartNumber++;
      }
    }
    $rootScope.$broadcast('cartChange');
    calculateMoney();
  }

  this.remove = function(good, shop) {
    var shopIndex = _.findIndex(totalCart, { 'shopId': shop.shopId });
    var goodIndex = _.findIndex(totalCart[shopIndex].goodsList, { 'productId': good.productId });
    var cartGood = toCartGood(good);
    var shopCart = toshopCart(shop);
    var tempNumber = --totalCart[shopIndex].goodsList[goodIndex].number;
    totalCart[shopIndex].number--;
    totalCartNumber--;
    if (tempNumber == 0) {
      totalCart[shopIndex].goodsList.splice(goodIndex, 1);
      if (totalCart[shopIndex].goodsList.length == 0) {
        totalCart.splice(shopIndex, 1);
      }
    }
    $rootScope.$broadcast('cartChange');
    calculateMoney();
  }

  this.getTotalCartNumber = function() {
    return totalCartNumber;
  }

  this.getTotalCartMoney = function() {
    calculateMoney();
    return totalCartMoney;
  }

  this.getGoodNumber = function(good, shop) {
    var shopIndex = _.findIndex(totalCart, { 'shopId': shop.shopId });
    if (shopIndex < 0) {
      return 0;
    } else {
      var goodIndex = _.findIndex(totalCart[shopIndex].goodsList, { 'productId': good.productId });
      return goodIndex < 0 ? 0 : totalCart[shopIndex].goodsList[goodIndex].number;
    }
  }

  this.getshopCartNumber = function(shopId) {
    var shopIndex = _.findIndex(totalCart, { 'shopId': shopId });
    if (shopIndex < 0) {
      return 0;
    } else {
      return totalCart[shopIndex].number;
    }
  }

  this.getshopProductList = function(shopId) {
    var shopIndex = _.findIndex(totalCart, { 'shopId': shopId });
    return totalCart[shopIndex].goodsList;
  }

  this.isGetThroesold = function() {
    isGetThroesold = true;
    if (totalCartMoney > 0) {
      $.each(totalCart, function(index, shopCart) {
        // 如果选择了，却为达到起送价
        if (shopCart.isChecked == true && shopCart.isReachStartPrice == false) {
          isGetThroesold = false;
        }
      });
    }
    return isGetThroesold;
  }

  this.checkShop = function(shop) {
    var shopIndex = _.findIndex(totalCart, { 'shopId': shop.shopId });
    $.each(totalCart[shopIndex].goodsList, function(index, value) {
      value.isChecked = totalCart[shopIndex].isChecked;
    });
    calculateMoney();
  }

  this.checkAll = function(isAllChecked) {
    $.each(totalCart, function(index, el) {
      el.isChecked = isAllChecked;
      $.each(el.goodsList, function(index, value) {
        value.isChecked = isAllChecked;
      });
    });
    calculateMoney();
  }

  this.checkShopGood = function() {
    calculateMoney();
  }

  this.cleanCart = function() {
    for (var i = totalCart.length - 1; i >= 0; i--) {
      if (totalCart[i]) {
        if (totalCart[i].isChecked) {
          totalCart.splice(i, 1);
        } else {
          for (var j = totalCart[i].goodsList.length - 1; j >= 0; j--) {
            if (totalCart[i].goodsList[j] && totalCart[i].goodsList[j].isChecked) {
              totalCart[i].goodsList.splice(j, 1);
            }
          }
        }
      }
    }
    localStorage.setItem('UxuanShoppingCart', JSON.stringify(carts));
  }

  function calculateMoney() {
    totalCartMoney = 0;
    $.each(totalCart, function(index, shopCart) {
      var tempTotalMoney = 0;
      $.each(shopCart.goodsList, function(index, value) {
        if (value.isChecked) {
          tempTotalMoney += value.productPrice * value.number;
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
      totalCartMoney += shopCart.singleCartTotalNumber;
    });
    localStorage.setItem('UxuanShoppingCart', JSON.stringify(totalCart));
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
//         'totalMoney': $scope.carts.allGoodsTotalMoney,
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
