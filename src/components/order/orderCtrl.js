angular.module('starter.controllers')

.controller('CartCtrl', function($scope, $rootScope, $state, $q, $timeout, $ionicPopup, UserInfo, NearByEguard,
  FruitOrderInsert, WxPay, WxPayParam, ShoppingCart, orderStatus, FruitOrWash,
  insertWashOrder, insertWashReserve) {
  var type = FruitOrWash.get();
  var isReserve = FruitOrWash.getParams().isReserve;
  $scope.$on("$ionicParentView.enter", function(event, data) {
    type = FruitOrWash.get();
  });

  UserInfo.then(function(user) {

    if (type == 'wash') {
      $scope.washOrder = FruitOrWash.getParams().washOrder;
      isReserve = FruitOrWash.getParams().isReserve;
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
      if (!judgeOrder()) {
        return;
      };

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
      if (FruitOrWash.getParams().washOrder) {
        orderData.shopId = FruitOrWash.getParams().washOrder.shopId
        orderData.orderIdsList = [FruitOrWash.getParams().washOrder.orderId]
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
            var sendData = FruitOrWash.get() == 'furit' ? {
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

    $scope.showAlert = function() {
      var alertPopup = $ionicPopup.alert({
        title: 'U选到家',
        template: '收货地址超出您选择店面服务范围'
      });
    }

    function isTooFar(address) {
      var deferred = $q.defer();
      var gc = new BMap.Geocoder();
      address = address || '';
      gc.getPoint(address, function(point) {
        var map = new BMap.Map("allmap");
        var pointA = new BMap.Point(user.longitude, user.latitude); // 创建点坐标A
        var pointB = new BMap.Point(point.lng, point.lat); // 创建点坐标B
        var distacne = (map.getDistance(pointA, pointB)).toFixed(2);
        if (distacne > 6000) {
          $scope.showAlert()
          deferred.resolve(true);
        } else {
          deferred.reject(false);
        }
      });
      return deferred.promise;
    }
  })
})



.controller('wxPayCtrl', function($scope, $state, $stateParams, WxPayParam, UserInfo,
  orderStatus, WxPay, WxPayConfirmWash, WxPayConfirmFruit) {
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
                  WxPayConfirmFruit.save({ 'orderIdsList': sendData.orderIdsList })
                } else {
                  WxPayConfirmWash.save({ 'orderIdsList': sendData.orderIdsList })
                }
                WxPayParam.set({});
                $state.go('app.orders');
              },
              cancel: function(res) {
                orderStatus.ordered();
                $state.go('app.orders')
              },
              complete: function(res) {

              }
            });
          });
        }, function() {
          alert('下订单成功，等待支付');
          orderStatus.ordered();
          $state.go('app.orders')
        })
    }
  })
})
