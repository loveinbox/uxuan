angular.module('starter.controllers')

.controller('OrderCtrl', function($scope, $rootScope, $state, $q, UserInfo, NearByEguard,
  FruitOrderInsert, WxPay, WxPayParam, ShoppingCart, orderStatus, FuritOrWash,
  insertWashOrder, insertWashReserve) {
  var type = FuritOrWash.get();
  var isReserve = FuritOrWash.getParams().isReserve;
  $scope.$on("$ionicParentView.enter", function(event, data) {
    type = FuritOrWash.get();
  });

  UserInfo.then(function(user) {

    // console.log('type', type);
    if (type == 'wash') {
      $scope.washOrder = FuritOrWash.getParams().washOrder;
      isReserve = FuritOrWash.getParams().isReserve;
    } else {
      isReserve = false;
    }

    $scope.type = type;
    $scope.order = {
      user: user,
      sendTime: [],
      guard: 0,
      carts: ShoppingCart.getCart(type),
      isReserve: isReserve
    }
    if (type == 'wash' && isReserve) {
      $scope.order.carts = [];
    }

    $scope.order.isAllChecked = true;
    $scope.status = {
      isAdded: false,
      isGetThroesold: ShoppingCart.isGetThroesold(type),
      isAddressValidated: false
    };
    $scope.order.totalMoney = ShoppingCart.getTotalCartMoney(type);

    if (user.rcvPhone) {
      $scope.status.isAdded = true;
      $scope.order.user.rcvName = user.rcvName;
      $scope.order.user.rcvPhone = user.rcvPhone;
      $scope.order.user.rcvAddress = user.rcvAddress;
    }

    isTooFar($scope.order.user.rcvAddress).then(function() {
      $scope.status.isAddressValidated = false;
    }, function() {
      $scope.status.isAddressValidated = true;
    })

    NearByEguard.get({
      'longitude': user.longitude,
      'latitude': user.latitude,
    }, function(data) {
      $scope.order.eGuards = data.data;
      $scope.order.guard = data.data[0].eguardId;
    }, function(data) {
      alert('NO DATA');
    });

    // if ((type == 'furit' && $scope.status.isGetThroesold == false) || ($scope.status.isAdded == false) || ($scope.order.carts.length == 0)) {
    //   $scope.orderButton = {
    //     'isDisabled': true
    //   }
    // } else {
    //   $scope.orderButton = {
    //     'isDisabled': false
    //   }
    // }

    $scope.$on('cartChange', function(event, data) {
      $scope.status.isGetThroesold = ShoppingCart.isGetThroesold(type);
      $scope.order.carts = ShoppingCart.getCart(type);
      $scope.order.totalMoney = ShoppingCart.getTotalCartMoney(type);
      judgeOrder();
    });

    $scope.pickShop = function(event, shop) {
      event.stopPropagation();
      ShoppingCart.checkShop(shop, type);
      $rootScope.$broadcast('cartChange');
    }

    $scope.pickShopGood = function(event, good, shop) {
      event.stopPropagation();
      ShoppingCart.checkShopGood(type, good, shop);
      $rootScope.$broadcast('cartChange');
    }

    $scope.pickAll = function() {
      ShoppingCart.checkAll($scope.order.isAllChecked, type);
      $rootScope.$broadcast('cartChange');
    }
    $scope.payButton = {
      text: '微信支付'
    }

    function judgeOrder() {
      $scope.payButton.text = '微信支付';
      if (type == 'furit' && $scope.status.isGetThroesold == false) {
        // alert('未达起送价');
        $scope.payButton.text = '未达起送价';
        return false;
      }
      if ($scope.status.isAdded == false) {
        // alert('请添加收货地址');
        $scope.payButton.text = '请添加收货地址';
        return false;
      }
      if ((type == 'furit' || !isReserve) && !$scope.order.carts.length) {
        // alert('请添加商品');
        $scope.payButton.text = '请添加商品';
        return false;
      }
      if (!$scope.status.isAddressValidated) {
        $scope.payButton.text = '请修改送货地址';
        return false;
      }
      if (isReserve) {
        $scope.payButton.text = '预约洗衣';
      } else {
        $scope.payButton.text = '微信支付';
      }
      return true;
    }
    $scope.confirmOrder = function(event) {
      if (!(user.verify - 0)) {
        $state.go('phoneNumberCheck');
        return;
      }
      event.stopPropagation();
      event.preventDefault();
      // if (user.name == '哈库那玛塔塔' || user.name == 'test') {
      if (!judgeOrder()) {
        return;
      };
      // }
      // if ((type == 'furit' && $scope.status.isGetThroesold == false) || ($scope.status.isAdded == false) || ($scope.order.carts.length == 0)) {
      //   return false;
      // }
      // 添加新订单

      var insertMethod = null;
      var orderData = {
        'latitude': user.longitude,
        'longitude': user.latitude,
        'userId': user.userId,
        'eguardId': $scope.order.guard,
        'rcvName': $scope.order.user.rcvName || 'test',
        'rcvPhone': $scope.order.user.rcvPhone || '123',
        'rcvAddress': $scope.order.user.rcvAddress || 'test',
        'preferRcvTime': [moment($scope.order.sendTime[0]).unix(), moment($scope.order.sendTime[1]).unix()], //期望收货时间
        'preferFetchTime': [moment($scope.order.sendTime[0]).unix(), moment($scope.order.sendTime[1]).unix()],
        'needTicket': false,
        'tip': '',
        'detail': ShoppingCart.getCart(type)
      };
      // console.log('rcvPhone', $scope.order.user.rcvPhone);
      // console.log('orderData', orderData.rcvPhone);
      if (FuritOrWash.getParams().washOrder) {
        orderData.shopId = FuritOrWash.getParams().washOrder.shopId
        orderData.orderIdsList = [FuritOrWash.getParams().washOrder.orderId]
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
              'orderIdsList': data.orderIdsList,
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
              $scope.order.user.rcvAddress = addressGot;
              $scope.order.user.rcvName = res.userName;
              $scope.order.user.rcvPhone = res.telNumber + '';
              $scope.status.isAdded = true;
              isTooFar(addressGot).then(function() {
                $scope.status.isAddressValidated = false;
              }, function() {
                $scope.status.isAddressValidated = true;
              })
            })
          }
        });
      });
    }

    function isTooFar(address) {
      var deferred = $q.defer();
      var gc = new BMap.Geocoder();
      // console.log('start to get location');
      address = address || '';
      gc.getPoint(address, function(point) {
        var map = new BMap.Map("allmap");
        var pointA = new BMap.Point(user.longitude, user.latitude); // 创建点坐标A
        var pointB = new BMap.Point(point.lng, point.lat); // 创建点坐标B
        // alert('两点的距离是：' + (map.getDistance(pointA, pointB)).toFixed(2) + ' 米。'); //获取两点距离,保留小数点后两位
        var distacne = (map.getDistance(pointA, pointB)).toFixed(2);
        if (distacne > 6000) {
          alert('收货地址超出您选择店面服务范围');
          deferred.resolve(true);
        } else {
          deferred.reject(false);
        }
      });
      return deferred.promise;
    }
  })
})


.controller('OrdersCtrl', function($scope, $rootScope, UserInfo, orderStatus, $state, StartPrice,
  OrderList, WxPayParam, cancelFurit, cancelWash, FuritOrWash) {

  UserInfo.then(function(user) {
    getOrders();
    $scope.$on("$ionicParentView.enter", function(event, data) {
      // console.log('loaded');
      getOrders();
    });

    $scope.doRefresh = function() {
      getOrders();
      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    }

    $scope.clickPrice = function(event, order) {
      event.stopPropagation();
      event.preventDefault();
      StartPrice.save({
          orderId: order.orderId
        })
        .$promise
        .then(function(res) {
          if (res.code === 0) {
            FuritOrWash.toWash(order, false);
            $state.go('washSingleOrder', { shopId: order.shopId, orderId: order.orderId });
          }
        });
    }

    $scope.clickRed = function(event, order) {
      event.stopPropagation();
      event.preventDefault();
      var cancelMethod = order.orderType == 17001 ? cancelFurit : cancelWash;
      cancelMethod.save({
          orderId: order.orderId
        })
        .$promise
        .then(function(res) {
          if (res.code === 0) {
            alert('取消成功');
            getOrders();
          }
        });
    }

    function getOrders() {
      OrderList.get({
        'customerId': user.userId,
        'pos': 0
      }, function(data) {
        $scope.orders = data.data;
      });
    }
  });
})

.controller('orderDetailCtrl', function($scope, $rootScope, $stateParams, FuritOrderDetail,
  WashOrderDetail, UserInfo, StartPrice, FuritOrWash, $state) {
  $scope.type = $stateParams.orderType;
  UserInfo.then(function(user) {
    getOrder();

    function getOrder(argument) {
      var detailMethod = $scope.type == 17001 ? FuritOrderDetail : WashOrderDetail;
      detailMethod.get({
        'longitude': user.longitude,
        'latitude': user.latitude,
        'orderId': $stateParams.orderId
      }, function(data) {
        $scope.order = data.data;
        var orderStage = data.data.orderStatusId
        if (orderStage - 0 <= 11003) {
          setStage([1]);
          return;
        }
        if (orderStage - 0 < 11008) {
          setStage([0, 1]);
          return;
        }
        if (orderStage - 0 < 11012) {
          setStage([0, 0, 1]);
          return;
        }
        if (orderStage - 0 <= 11015) {
          setStage([0, 0, 0, 1]);
          return;
        }
      });
    }

    $scope.clickPrice = function(event, order) {
      event.stopPropagation();
      event.preventDefault();
      StartPrice.save({
          orderId: order.orderId
        })
        .$promise
        .then(function(res) {
          if (res.code === 0) {
            FuritOrWash.toWash(order, true);
            $state.go('washSingleOrder', { shopId: order.shopId, orderId: order.orderId });
          }
        });
    }
  })

  function setStage(array) {
    $scope.stage01 = (array[0] === 1);
    $scope.stage02 = (array[1] === 1);
    $scope.stage03 = (array[2] === 1);
    $scope.stage04 = (array[3] === 1);
  }
})

.controller('wxPayCtrl', function($scope, $state, $stateParams, WxPayParam, UserInfo,
  orderStatus, WxPay, WxPayConfirmWash, WxPayConfirmFurit) {
  UserInfo.then(function(user) {
    $scope.$on("$ionicParentView.leave", function(event, data) {
      // console.log('loaded');
      localStorage.setItem('backForbidden', true);
    });
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
                // alert('下订单成功，等待支付');
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
