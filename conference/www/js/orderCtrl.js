angular.module('starter.controllers')

.controller('OrderCtrl', function($scope, $rootScope, $state, $q, UserInfo, NearByEguard,
  FruitOrderInsert, WxPay, WxPayParam, ShoppingCart, orderStatus, FuritOrWash,
  insertWashOrder, insertWashReserve) {
  UserInfo.then(function(user) {
    var type = FuritOrWash.get();
    var isReserve = FuritOrWash.getParams().isReserve;
    $scope.order = {
      user: user,
      sendTime: [],
      guard: 0,
      carts: ShoppingCart.getCart(type),
      isReserve: isReserve
    }
    if (isReserve) {
      $scope.order.carts = {}
    }

    $scope.order.isAllChecked = true;
    $scope.status = {
      isAdded: false,
      isGetThroesold: false,
      isAddressValidated: false
    };
    $scope.order.totalMoney = ShoppingCart.getTotalCartMoney(type);

    NearByEguard.get({
      'longitude': user.longitude,
      'latitude': user.latitude,
    }, function(data) {
      $scope.order.eGuards = data.data;
      $scope.order.guard = data.data[0].eguardId;
    }, function(data) {
      alert('NO DATA');
    });

    $scope.$on('cartChange', function(event, data) {
      $scope.status.isGetThroesold = ShoppingCart.isGetThroesold(type);
      $scope.order.carts = ShoppingCart.getCart(type);
      $scope.order.totalMoney = ShoppingCart.getTotalCartMoney(type);
    });

    $scope.pickShop = function(event, shop) {
      event.stopPropagation();
      ShoppingCart.checkShop(shop, type);
      $rootScope.$broadcast('cartChange');
    }

    $scope.pickShopGood = function(event, good, shop) {
      event.stopPropagation();
      ShoppingCart.checkShopGood(good, shop, type);
      $rootScope.$broadcast('cartChange');
    }

    $scope.pickAll = function() {
      ShoppingCart.checkAll($scope.order.isAllChecked, type);
      $rootScope.$broadcast('cartChange');
    }
    $scope.confirmOrder = function() {
      // if ($scope.status.isGetThroesold !== true || $scope.status.isAddressValidated !== true) {
      //   return;
      // }

      // 添加新订单

      var insertMethod = null;
      var orderData = {
        'latitude': user.longitude,
        'longitude': user.latitude,
        'userId': user.userId,
        'eguardId': $scope.order.guard,
        'rcvName': $scope.order.user.name,
        'rcvPhone': $scope.order.user.tel,
        'rcvAddress': $scope.order.user.address,
        'preferRcvTime': $scope.order.sendTime, //期望收货时间
        'preferFetchTime': $scope.order.sendTime,
        'needTicket': false,
        'tip': '',
        'detail': ShoppingCart.getCart(type),
        'shopId': FuritOrWash.getParams().washShopId,
        'orderIdsList': [FuritOrWash.getParams().washOrderId]
      };
      if (type == 'furit') {
        insertMethod = FruitOrderInsert;
      } else {
        if (isReserve) {
          insertMethod = insertWashReserve;
        } else {
          insertMethod = insertWashOrder;
          orderData.detail = ShoppingCart.getCart(type)[0].productsList;
        }
      }
      insertMethod.save(orderData)
        .$promise
        .then(function(res) {
          if (isReserve) {
            alert('预约成功');
            ShoppingCart.cleanCart(type);
            $state.go('app.orders');
          } else {
            var data = res.data;
            var sendData = FuritOrWash.get() == 'furit' ? {
              'orderIdsList': data.orderIdsList,
              'orderType': 17001
            } : {
              'orderIdsList': [data.orderIdsList],
              'orderType': 17002
            };
            sendData.money = data.money;
            WxPayParam.set(sendData);
            ShoppingCart.cleanCart(type);
            $state.go('pay');
          }
        })
        .catch(function(res) {
          alert('下订单失败');
          orderStatus.failed();
          $state.go('app.orders');
        })
        .finally(function() {})
    }

    $scope.getAddress = function(event) {
      wx.ready(function() {
        wx.openAddress({
          success: function(res) {
            var addressGot = res.provinceName + res.cityName + res.countryName +
              res.detailInfo;
            $scope.$apply(function() {
              $scope.order.user.address = addressGot;
              $scope.order.user.name = res.userName;
              $scope.order.user.tel = res.telNumber + '';
              $scope.status.isAdded = true;
              isTooFar(addressGot).then(function() {
                $scope.status.isAddressValidated = true;
              }, function() {
                $scope.status.isAddressValidated = false;
              })
            })
          }
        });
      });

      function isTooFar(address) {
        var deferred = $q.defer();
        var gc = new BMap.Geocoder();
        console.log('start to get location');
        gc.getPoint(address, function(point) {
          var map = new BMap.Map("allmap");
          var pointA = new BMap.Point(user.longitude, user.latitude); // 创建点坐标A
          var pointB = new BMap.Point(point.lng, point.lat); // 创建点坐标B
          // alert('两点的距离是：' + (map.getDistance(pointA, pointB)).toFixed(2) + ' 米。'); //获取两点距离,保留小数点后两位
          var distacne = (map.getDistance(pointA, pointB)).toFixed(2);
          if (distacne > 6000) {
            alert('收货地址可能超出配送范围');
            deferred.resolve(true);
          } else {
            deferred.reject(false);
          }
        });
        return deferred.promise;
      }
    }
  })
})


.controller('OrdersCtrl', function($scope, $rootScope, QueryOrderList, PayConfirm, OrderCancel,
  UserInfo, orderStatus, $state, StartPrice, FuritOrWash, WxPayParam) {
  UserInfo.then(function(user) {
    getOrders();
    $scope.$on("$ionicParentView.enter", function(event, data) {
      console.log('loaded');
      getOrders();
    });

    $scope.doRefresh = function() {
      console.log('Refreshing!', UserInfo.userid);
      getOrders();
      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    }

    $scope.clickPrice = function(order) {
      StartPrice.get({
          orderId: order.orderId
        })
        .$promise
        .then(function(res) {
          if (res.code === 0) {
            FuritOrWash.toWash(order.shopId, order.orderId, true);
            $state.go('washSingleOrder', { shopId: order.shopId, orderId: order.orderId });
          }
        })
    }

    function getOrders() {
      QueryOrderList.get({
        'customerId': user.userId,
        'pos': 0
      }, function(data) {
        $scope.orders = data.data;
      });
    }
  });
})

.controller('orderDetailCtrl', function($scope, $rootScope, $stateParams, QueryOrderDetail,
  PayConfirm, UserInfo, WxPayParam) {
  UserInfo.then(function(user) {
    getOrder();
  })

  function getOrder(argument) {
    QueryOrderDetail.get({
      'longitude': user.longitude,
      'latitude': user.latitude,
      'orderId': $stateParams.orderId
    }, function(data) {
      $scope.order = data.data;
    });
  }
})

.controller('wxPayCtrl', function($scope, $state, $stateParams, WxPayParam, PayConfirm, UserInfo,
  orderStatus, WxPay, WxPayConfirmWash, WxPayConfirmFurit) {
  UserInfo.then(function(user) {
    var sendData = WxPayParam.get();
    $scope.pay = {
      money: sendData.money
    };
    $scope.payOrder = function() {
      WxPay.save(sendData)
        .$promise
        .then(function(res) {
          wx.ready(function() {
            wx.chooseWXPay({
              timestamp: res.timeStamp,
              nonceStr: res.nonceStr,
              package: res.package,
              signType: res.signType,
              paySign: res.paySign,
              success: function(res) {
                alert('支付成功');
                orderStatus.paied();
                if (sendData.orderType == 17001) {
                  WxPayConfirmFurit.save({ 'orderIdsList': sendData.orderIdsList })
                    // .$promise
                    // .finally(function() {
                    //   // window.location.replace('/app/orders');
                    //   $state.go('app.orders')
                    // });
                } else {
                  WxPayConfirmWash.save({ 'orderIdsList': sendData.orderIdsList })
                    // .$promise
                    // .finally(function() {
                    //   WxPayParam.set({});
                    //   // window.location.replace('/app/orders');
                    //   $state.go('app.orders')
                    // })
                }
                WxPayParam.set({});
                $state.go('app.orders');
              },
              cancel: function(res) {
                alert('下订单成功，等待支付');
                orderStatus.ordered();
                // window.location.replace('/app/orders');
                $state.go('app.orders')
              },
              complete: function(res) {

              }
            });
          });
        }, function() {
          alert('下订单成功，等待支付');
          orderStatus.ordered();
          // window.location.replace('/app/orders');
          $state.go('app.orders')
        })
    }
  })
})
