angular.module('starter.controllers')
  .controller('OrderCtrl', function($scope, $rootScope, $state, UserInfo, NearByEguard, FruitOrderInsert, PayConfirm, ShoppingCart) {
    UserInfo.then(function(user) {
      $scope.order = {
        user: user,
        sendTime: [],
        guard: 0,
        carts: ShoppingCart.getCart()
      }
      NearByEguard.get({
        'longitude': user.longitude,
        'latitude': user.latitude,
      }, function(data) {
        $scope.order.eGuards = data.data;
        $scope.order.guard = data.data[0].id;
      }, function(data) {
        alert('NO DATA');
      });

      $scope.orderButton = { isDisabled: true };
      $scope.$on('cartChange userChange', function(event, data) {
        $scope.orderButton.isDisable = ShoppingCart.canOrder;
        $scope.order.carts = ShoppingCart.getCart();
      });

      $scope.confirmOrder = function() {
        if ($scope.orderButton.isDisabled) {
          return;
        }
        ShoppingCart.cleanCart();
        // 添加新订单
        FruitOrderInsert.post($scope.order,
          function(res) {
            // 确认支付完成
            // PayConfirm.post();
          })

      }

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

      $scope.getAddress = function() {
        wx.ready(function() {
          wx.openAddress({
            success: function(res) {
              var addressGot = res.provinceName + res.cityName + res.countryName + res.detailInfo;
              $scope.$apply(function() {
                isTooFar(addressGot).then(function(isOutofRang) {
                  if (!isOutofRang) {
                    $scope.order.user.address = addressGot;
                    $scope.order.user.name = res.userName;
                    $scope.order.user.tel = parseInt(res.telNumber);
                    $rootScope.$broadcast('userChange');
                  }
                })
              });
            },
            cancel: function() {
              // alert("fa");
            }
          });
        });
      }

      function isTooFar(address) {
        var deferred = $q.defer();
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
            deferred.resolve(false);
          } else {
            deferred.resolve(true);
          }
          return deferred.promise;
        });
      }
    })
  })
