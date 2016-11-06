angular.module('starter.controllers')

.controller('washListCtrl', function($scope, UserInfo, MainPageHot, getWashShops) {
  $scope.location = {};
  UserInfo.then(function(user) {
    getWashShops.get({
      'longitude': user.longitude,
      'latitude': user.latitude,
      'sellerId': 2
    }, function(data) {
      $scope.sellers = data.data;
    }, function(data) {
      alert('NO DATA MainPageHot');
    });
  })

})

.controller('washSingleCtrl', function($scope, $stateParams, $ionicScrollDelegate, UserInfo, MainPageHot, getWashShop) {
  UserInfo.then(function(user) {
    getWashShop.get({
      'longitude': user.longitude,
      'latitude': user.latitude,
      'sellerId': $stateParams.washId
    }, function(res) {
      var scrollArray = [];
      var count = 0;
      var lastId = -1;
      $scope.seller = res.data.shop;
      $scope.goods = Array.prototype.slice.call(res.data.productsList)
        .sort(function(a, b) {
          return a.classifyId - b.classifyId;
        });
      $scope.classes = Array.prototype.slice.call(res.data.classify)
        .sort(function(a, b) {
          return a.classifyId - b.classifyId;
        });
      $scope.goods
        .forEach(function(el, index) {
          if (el.classifyId != lastId) {
            lastId = el.classifyId;
            scrollArray[el.classifyId] = count;
          }
          count++;
        });

    }, function(data) {
      alert('NO DATA MainPageHot');
    });
  });

  $scope.washScrollTo = function(classifyId) {
    $ionicScrollDelegate.$getByHandle('wash-scroll').scrollTo(0, scrollArray[classifyId] * 109, true);
  }

})

.controller('washCartController', function($scope, $state, UserInfo, orderStatus, NearByEguard, WxLocation) {
  UserInfo.then(function(user) {
    NearByEguard.get({
      'longitude': user.longitude,
      'latitude': user.latitude,
    }, function(data) {
      $scope.eGuard = data.data;
      $scope.order.guard = data.data[0].id;
    }, function(data) {
      alert('NO DATA');
    });

    $scope.order = {
      receiverName: user.addressInfo.username || '收货人姓名',
      receiverPhone: user.addressInfo.tel || '收货人手机',
      receiverAddress: user.addressInfo.address || '收货地址',
      orderDate: []
    };
    $scope.orderButton = { isDisabled: true };
    $scope.carts = ShoppingCart.getCart();
    $scope.userPreferTime = {
      value: 1
    };

    $scope.confirmOrder = function() {
      // if ($scope.order.receiverAddress === undefined || $scope.order.receiverAddress === '' || $scope.order.receiverAddress === '收货地址') {
      //   alert('请输入收货地址');
      //   return;
      // }

      var orderIds = null;

      orderRequestObj = {
        url: 'http://www.lifeuxuan.com/backend/api/WashReserveOrderInsert.php?XDEBUG_SESSION_START=657409A8',
        data: {
          'longitude': user.longitude,
          'latitude': user.latitude,
          // 'orderTime': moment,
          'userId': user.userId,
          'userPhoneNumber': $scope.order.receiverPhone + "",
          'userAddress': $scope.order.receiverAddress,
          'userPreferTime': $scope.userPreferTime,
          'eguardId': $scope.order.guard + "",
          'isPaid': true,
          'totalMoney': 1,
          'note': $scope.order.note || "无" + "",
          'username': $scope.order.receiverName,
          'sellerId': $stateParams.shopId,
          'orderTime': '2016-07-04 19:00:40'
        }
      };
      $.ajax(orderRequestObj)
        .done(function(e) {
          var data = JSON.parse(e);
          console.log(data.message);
          $scope.$apply(function() {
            if (data.code != -1) {
              orderStatus.ordered();
              $state.go('app.orders');
            } else {
              orderStatus.failed();
              $state.go('app.orders');
            }
          })
        })
        .fail(function(e) {
          console.log("error", e);
        });
    }

    $scope.getAddress = function() {
      WxLocation.getAddress()
        .then(function() {
          orderRequestObj.receiverAddress = addressGot;
          orderRequestObj.receiverName = res.userName;
          orderRequestObj.receiverPhone = res.telNumber;
        })
    }
  })
})

.controller('washSingleOrderCtrl', function($scope, $stateParams, $ionicScrollDelegate, $ionicModal, UserInfo, getWashShop, ShoppingCart) {
  UserInfo.then(function(user) {
    getWashShop.get({
      'longitude': user.longitude,
      'latitude': user.latitude,
      'sellerId': $stateParams.washId
    }, function(res) {
      var count = 0;
      var lastId = -1;
      var scrollArray = [];
      $scope.seller = res.data.shop;
      $scope.goods = Array.prototype.slice.call(res.data.productsList)
        .sort(function(a, b) {
          return a.classifyId - b.classifyId;
        });
      $scope.classes = Array.prototype.slice.call(res.data.classify)
        .sort(function(a, b) {
          return a.classifyId - b.classifyId;
        });
      $scope.goods
        .forEach(function(el, index) {
          if (el.classifyId != lastId) {
            lastId = el.classifyId;
            scrollArray[el.classifyId] = count;
          }
          count++;
        });

      // 显示购物车数量  
      $scope.totalNumber = ShoppingCart.getSellerCartNumber($scope.seller.sellerId);
    }, function(data) {
      alert('NO DATA MainPageHot');
    });
  });

  $scope.$on('cartChange', function(event, data) {
    // 更新购物车数量  
    $scope.totalNumber = ShoppingCart.getSellerCartNumber($scope.seller.sellerId);
  });

  $scope.washScrollTo = function(classifyId) {
    $ionicScrollDelegate.$getByHandle('wash-scroll').scrollTo(0, scrollArray[classifyId] * 109, true);
  }
})

.controller('washCartOrderController', function($scope, $stateParams, $ionicHistory, $rootScope, $location, $state, UserInfo, orderStatus, NearByEguard, FruitOrderInsert, PayConfirm, $http, ShoppingCart) {
  UserInfo.then(function(user) {
    $scope.order = {
      receiverName: user.addressInfo.username || '收货人姓名',
      receiverPhone: user.addressInfo.tel || '收货人手机',
      receiverAddress: user.addressInfo.address || '收货地址'
    };
    $scope.order.guard = 1;
    $scope.orderButton = { isDisabled: true };
    $scope.carts = ShoppingCart.getCart();
    $scope.userPreferTime = {
      value: 1
    };

    var orderRequestObj = {
      url: 'http://www.lifeuxuan.com/backend/api/FruitOrderInsert.php',
      data: {
        'longitude': user.longitude,
        'latitude': user.latitude,
        // 'orderTime': moment,
        'userId': user.userId,
        'userPhoneNumber': $scope.order.receiverPhone + "",
        'userAddress': $scope.order.receiverAddress,
        'userPreferTime': $scope.userPreferTime.value,
        'eguardId': $scope.order.guard + "",
        'isPaid': true,
        'totalMoney': $scope.carts.allGoodsTotalMoney,
        // 'note': $scope.order.note || "无",
        'productList': $scope.carts,
        'username': ''
      }
    };

    NearByEguard.get({
      'longitude': user.longitude,
      'latitude': user.latitude,
    }, function(data) {
      $scope.eGuard = data.data;
      $scope.order.guard = data.data[0].id;
    }, function(data) {
      alert('NO DATA');
    });

    function judgeOrder() {
      if ($scope.carts.allGoodsTotalMoney > 0) {
        $scope.orderButton.isDisabled = false;
        $.each($scope.carts, function(index, cart) {
          if (cart.isChecked && cart.seller.isReachStartPrice == false) {
            $scope.orderButton.isDisabled = true;
          }
        });
      }
    }

    $scope.calculateMoney = function(event, cart) {
      $scope.isAllChecked = false;
      $.each(cart.goodsList, function(index, value) {
        value.isChecked = cart.isChecked;
      });
      cartList();
      judgeOrder();
    }

    $scope.calculateSingleMoney = function(event, cart) {
      event.stopPropagation();
      var isAllSelected = true;
      $scope.isAllChecked = false;
      // is all goods selected
      $.each(cart.goodsList, function(index, value) {
        if (!value.isChecked) {
          isAllSelected = false;
        }
      });
      cart.isChecked = isAllSelected;
      cartList();
      judgeOrder();
    }

    $scope.pickAll = function() {
      cartListInit($scope.order.isAllChecked);
    }

    cartListInit(true);

    function cartListInit(isCheck) {
      var carts = ShoppingCart.getCart();
      $scope.carts = carts;
      $scope.carts.allGoodsTotalMoney = 0;
      $scope.order.isAllChecked = isCheck;

      $.each(carts, function(index, cart) {
        var tempTotalMoney = 0;
        if (cart.isChecked == undefined) {
          cart.isChecked = isCheck;
        }
        $.each(cart.goodsList, function(index, value) {
          if (value.isChecked == undefined) {
            value.isChecked = isCheck;
          }
          if (value.isChecked) {
            tempTotalMoney += value.price * value.quantity;
          }
        });
        $scope.carts.allGoodsTotalMoney += cart.seller.totalMoney = tempTotalMoney + cart.seller.sendPrice * 100;
        if (cart.seller.totalMoney <= cart.seller.sendStartPrice * 100) {
          cart.seller.isReachStartPrice = false;
        } else {
          cart.seller.isReachStartPrice = true;
        }
      });
      judgeOrder();
    };

    function cartList() {
      $scope.carts.allGoodsTotalMoney = 0;
      $.each($scope.carts, function(index, cart) {
        var tempTotalMoney = 0;
        $.each(cart.goodsList, function(index, value) {
          if (value.isChecked) {
            tempTotalMoney += value.price * value.quantity;
          }
        });
        cart.seller.totalMoney = tempTotalMoney;
        // 是否计算运费
        if (tempTotalMoney > 0) {
          cart.seller.totalMoney += cart.seller.sendPrice * 100;
        }
        // 是否达到起送价
        if (cart.seller.totalMoney <= cart.seller.sendStartPrice * 100) {
          cart.seller.isReachStartPrice = false;
        } else {
          cart.seller.isReachStartPrice = true;
        }
        $scope.carts.allGoodsTotalMoney += cart.seller.totalMoney;
      });
      localStorage.setItem('cart', JSON.stringify($scope.carts));
      judgeOrder();
    };

    function cleanCart() {
      var carts = ShoppingCart.getCart();
      for (var i = carts.length - 1; i >= 0; i--) {
        if (carts[i]) {
          if (carts[i].isChecked) {
            carts.splice(i, 1);
          } else {
            for (var j = carts[i].goodsList.length - 1; j >= 0; j--) {
              if (carts[i].goodsList[j] && carts[i].goodsList[j].isChecked) {
                carts[i].goodsList.splice(j, 1);
              }
            }
          }
        }
      }
      localStorage.setItem('cart', JSON.stringify(carts));
    }

    $scope.confirmOrder = function() {
      if ($scope.orderButton.isDisabled) {
        return;
      }
      if ($scope.order.receiverAddress === undefined || $scope.order.receiverAddress === '' || $scope.order.receiverAddress === '收货地址') {
        alert('请输入收货地址');
        return;
      }

      var orderIds = null;
      var cleanedCarts = ShoppingCart.getCart();
      (function cleanUnckeck() {
        for (var i = cleanedCarts.length - 1; i >= 0; i--) {
          if (cleanedCarts[i]) {
            if (!cleanedCarts[i].isChecked) {
              cleanedCarts.splice(i, 1);
            } else {
              for (var j = cleanedCarts[i].goodsList.length - 1; j >= 0; j--) {
                if (cleanedCarts[i].goodsList[j] && !cleanedCarts[i].goodsList[j].isChecked) {
                  cleanedCarts[i].goodsList.splice(j, 1);
                }
              }
            }
          }
        }
      })();

      $.ajax(orderRequestObj)
        .done(function(e) {
          var data = JSON.parse(e);
          console.log(data.message);
          $scope.$apply(function() {
            if (data.code != -1) {
              ForwardPay();
              orderIds = data.data;
              console.log('data', data);
            } else {
              orderStatus.failed();
              $state.go('app.orders');
            }
          })
        })
        .fail(function(e) {
          console.log(e);
          console.log("error");
        })
        .always(function() {
          console.log("complete");
        });

      function ForwardPay() {

        $.ajax({
            url: 'http://www.lifeuxuan.com/backend/wxpay/pay/WxPayCtrl.php',
            type: 'GET',
            dataType: 'json',
            data: {
              //'openId': 'oDHyIvznjdxR2KFmyAjWMs2S0lyU',
              // 'payMoney': $scope.carts.allGoodsTotalMoney
              'payMoney': '1'
            }
          })
          .done(function(e) {
            // cleanCart();
            // alert(e);
            wx.ready(function() {
              // alert(e);
              wx.chooseWXPay({
                timestamp: e.timeStamp,
                nonceStr: e.nonceStr,
                package: e.package,
                signType: e.signType,
                paySign: e.paySign,
                success: function(res) {
                  orderStatus.paied();
                  console.log('paied success');
                  console.log('111 orderIds', orderIds);
                  console.log('111 orderIds is Array', Array.isArray(orderIds));
                  PayConfirm.get({
                    'longitude': user.longitude,
                    'latitude': user.latitude,
                    'orderId\[\]': orderIds
                  }, function(data) {
                    console.log('pay PayConfirm');
                    $state.go('app.orders');
                  });
                },
                cancel: function(res) {
                  orderStatus.ordered();
                  console.log('ordered success');
                  $state.go('app.orders');
                },
                complete: function(res) {
                  cleanCart();
                }

              });
            });

          })
          .fail(function(e) {})
          .always(function() {});
      };

      // $state.go('app.orders');
    }

    $scope.getAddress = function() {
      wx.ready(function() {
        wx.openAddress({
          success: function(res) {
            var addressGot = res.provinceName + res.cityName + res.countryName + res.detailInfo;
            $scope.$apply(function() {
              if (isTooFar(addressGot)) {
                alert('输入的地址超出配送范围，请重新选择');
                return;
              }
              $scope.order.receiverAddress = addressGot || '';
              $scope.order.receiverName = res.userName;
              $scope.order.receiverPhone = res.telNumber - 0;

              var carts = ShoppingCart.getCart();
              if ($scope.carts.allGoodsTotalMoney > 0) {
                $scope.orderButton.status = false;
              }
              judgeOrder();
            });
          },
          cancel: function() {
            alert("fa");
          }
        });
      });
    }

    function isTooFar(address) {
      var gc = new BMap.Geocoder();
      gc.getPoint(address, function(point) {
        var map = new BMap.Map("allmap");
        var pointA = new BMap.Point(user.longitude, user.latitude); // 创建点坐标A
        var pointB = new BMap.Point(point.lng, point.lat); // 创建点坐标B
        // alert('两点的距离是：' + (map.getDistance(pointA, pointB)).toFixed(2) + ' 米。'); //获取两点距离,保留小数点后两位
        var distacne = (map.getDistance(pointA, pointB)).toFixed(2);
        console.log('distacne', distacne);
        console.log('distacne > 6000', distacne > 6000);
        if (distacne > 6000) {
          alert('收货地址可能超出配送范围');
          return true;
        } else {
          return false;
        }
      });
    }

    $scope.$on('cartChange', function(event, data) {
      cartList();
    });
  })



})
