angular.module('starter.controllers')
  .controller('OrderCtrl', function($scope, $rootScope, $state, $q, UserInfo, NearByEguard, FruitOrderInsert, PayConfirm, ShoppingCart, orderStatus) {
    UserInfo.then(function(user) {
      $scope.order = {
        user: user,
        sendTime: [],
        guard: 0,
        carts: ShoppingCart.getCart()
      }
      $scope.order.isAllChecked = true;
      $scope.status = {
        isGetThroesold: false,
        isAddressValidated: false
      };

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
        $scope.status.isGetThroesold = ShoppingCart.isGetThroesold();
        $scope.order.carts = ShoppingCart.getCart();
      });

      $scope.pickShop = function(event, shop) {
        event.stopPropagation();
        ShoppingCart.checkShop(shop);
        $scope.order.carts = ShoppingCart.getCart();
      }

      $scope.pickShopGood = function(event, good, shop) {
        event.stopPropagation();
        ShoppingCart.checkShopGood(good, shop);
        $scope.order.carts = ShoppingCart.getCart();
      }

      $scope.pickAll = function() {
        $scope.order.isAllChecked = !$scope.order.isAllChecked;
        $scope.order.carts = ShoppingCart.getCart();
      }

      $scope.confirmOrder = function() {
        // if ($scope.status.isGetThroesold !== true || $scope.status.isAddressValidated !== true) {
        //   return;
        // }

        // 添加新订单
        var orderData = {
          'latitude': user.longitude,
          'longitude': user.latitude,
          'userId': user.userId,
          'eguardId': $scope.order.guard,
          'rcvName': $scope.order.user.name,
          'rcvPhone': $scope.order.user.tel,
          'rcvAddress': $scope.order.user.address,
          'preferRcvTime': ['1', '2'], //期望收货时间
          'needTicket': false,
          'tip': '',
          'detail': ShoppingCart.getCart()
        }
        FruitOrderInsert.save(orderData)
          .$promise
          .then(function(res) {
            ShoppingCart.cleanCart();
            PayConfirm.psot(res.ordersId)
              .then(function() {
                orderStatus.paied();
              }, function() {
                orderStatus.ordered();
              })
            $state.go('app.orders');
          }, function() {
            orderStatus.failed();
            $state.go('app.orders');
          })
      }

      $scope.getAddress = function(event) {
        wx.ready(function() {
          wx.openAddress({
            success: function(res) {
              var addressGot = res.provinceName + res.cityName + res.countryName + res.detailInfo;
              $scope.$apply(function() {
                $scope.order.user.address = addressGot;
                $scope.order.user.name = res.userName;
                $scope.order.user.tel = res.telNumber;
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
