angular.module('starter.washControllers', []);

angular.module('starter.washControllers')

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

.controller('washSingleCtrl', function($scope, $stateParams, UserInfo, MainPageHot, getWashShop) {
  $scope.location = {};
  UserInfo.then(function(user) {
    getWashShop.get({
      'longitude': user.longitude,
      'latitude': user.latitude,
      'sellerId': $stateParams.washId
    }, function(res) {
      $scope.seller = res.data.shop;
      $scope.goods = res.data.firstData;
    }, function(data) {
      alert('NO DATA MainPageHot');
    });
  })

})

.controller('washCartController', function($scope, $stateParams, $ionicHistory, $rootScope, $location, $state, UserInfo, orderStatus, NearByEguard, FruitOrderInsert, PayConfirm, $http, ShoppingCart) {
  UserInfo.then(function(user) {
    $scope.order = {
      receiverName: '收货人姓名',
      receiverPhone: '收货人手机',
      receiverAddress: '收货地址',
      orderDate: []
    };
    $scope.order.guard = 1;
    $scope.orderButton = { isDisabled: true };
    $scope.carts = ShoppingCart.getCart();

    // $scope.order.receiverAddress = '123';

    var orderRequestObj = {
      url: 'http://www.lifeuxuan.com/backend/api/FruitOrderInsert.php',
      data: {
        'longitude': user.longitude,
        'latitude': user.latitude,
        // 'orderTime': moment,
        'userId': user.userId || '1',
        'userPhoneNumber': $scope.order.receiverPhone + "",
        'userAddress': $scope.order.receiverAddress,
        'userPreferTime': $scope.userPreferTime,
        'eguardId': $scope.order.guard + "",
        'isPaid': true,
        'totalMoney': $scope.carts.allGoodsTotalMoney,
        'note': $scope.order.note || "无" + "",
        'productList': ShoppingCart.getCart(),
        'username': ''
      }
    };

    function judgeOrder() {
      orderRequestObj = {
        url: 'http://www.lifeuxuan.com/backend/api/FruitOrderInsert.php',
        data: {
          'longitude': user.longitude,
          'latitude': user.latitude,
          // 'orderTime': moment,
          'userId': user.userId || '1',
          'userPhoneNumber': $scope.order.receiverPhone + "",
          'userAddress': $scope.order.receiverAddress,
          'userPreferTime': $scope.userPreferTime,
          'eguardId': $scope.order.guard + "",
          'isPaid': true,
          'totalMoney': $scope.carts.allGoodsTotalMoney,
          'note': $scope.order.note || "无" + "",
          'productList': ShoppingCart.getCart(),
          'username': ''
        }
      };

      if ($scope.carts.allGoodsTotalMoney > 0) {
        $scope.orderButton.isDisabled = false;
        $.each(orderRequestObj.data.productList, function(index, cart) {
          if (cart.isChecked && cart.seller.isReachStartPrice == false) {
            $scope.orderButton.isDisabled = true;
          }
        });
      }
    }

    (function dateFun() {
      $scope.from = { bool: $stateParams.from > 0 };

      var weekArray = ['日', '一', '二', '三', '四', '五', '六'];
      var weight = 0;

      var date = new Date,
        startHour = date.getHours() > 8 ? date.getHours() : 8;

      if (startHour >= 20) {
        weight = 1;
      }

      $scope.date = {
        week: weekArray[date.getDay() + weight]
      }

      for (var i = 0 + weight; i < 8; i++) {
        $scope.order.orderDate.push({
          name: addDate(date, i),
          value: i
        })
      }

      $scope.order.preferTimeDay = weight;

      $scope.order.orderTime = [];

      if (weight == 0) {
        for (var i = 1; startHour + i < 21; i++) {
          $scope.order.orderTime.push({
            name: addZero(startHour + i) + ':00 -- ' + addZero(startHour + i) + ':30',
            value: addZero(startHour + i) + ':00 -- ' + addZero(startHour + i) + ':30'
          })
          $scope.order.orderTime.push({
            name: addZero(startHour + i) + ':30 -- ' + addZero(startHour + i + 1) + ':00',
            value: addZero(startHour + i) + ':30 -- ' + addZero(startHour + i + 1) + ':00'
          })
        }
      } else {
        for (var i = 8; i < 21; i++) {
          $scope.order.orderTime.push({
            name: addZero(i) + ':00 -- ' + addZero(i) + ':30',
            value: addZero(i) + ':00 -- ' + addZero(i) + ':30'
          })
          $scope.order.orderTime.push({
            name: addZero(i) + ':30 -- ' + addZero(i + 1) + ':00',
            value: addZero(i) + ':30 -- ' + addZero(i + 1) + ':00'
          })
        }
      }

      if ($scope.order.orderTime.length > 0) {
        $scope.order.preferTimeTime = $scope.order.orderTime[0].value;
      }

      $scope.changeDate = function() {
        if ($scope.order.preferTimeDay > 0) {
          $scope.order.orderTime = [];
          for (var i = 8; i < 21; i++) {
            $scope.order.orderTime.push({
              name: addZero(i) + ':00 -- ' + addZero(i) + ':30',
              value: addZero(i) + ':00 -- ' + addZero(i) + ':30'
            })
            $scope.order.orderTime.push({
              name: addZero(i) + ':00 -- ' + addZero(i + 1) + ':00',
              value: addZero(i) + ':00 -- ' + addZero(i + 1) + ':00'
            })
          }
          $scope.order.preferTimeTime = $scope.order.orderTime[0].value;
        } else {
          $scope.order.orderTime = [];
          for (var i = 1; startHour + i < 21; i++) {
            $scope.order.orderTime.push({
              name: addZero(startHour + i) + ':00 -- ' + addZero(startHour + i) + ':30',
              value: addZero(startHour + i) + ':00 -- ' + addZero(startHour + i) + ':30'
            })
            $scope.order.orderTime.push({
              name: addZero(startHour + i) + ':30 -- ' + addZero(startHour + i + 1) + ':00',
              value: addZero(startHour + i) + ':30 -- ' + addZero(startHour + i + 1) + ':00'
            })
          }
          $scope.order.preferTimeTime = $scope.order.orderTime[0].value;
        }
        $scope.date = {
          week: weekArray[(date.getDay() + $scope.order.preferTimeDay) % 7]
        }
      }
    })();

    function addDate(date, days) {
      if (days === undefined || days === '') {
        days = 1;
      }
      var date = new Date(date);
      date.setDate(date.getDate() + days);
      var month = date.getMonth() + 1;
      var day = date.getDate();
      return addZero(month) + '-' + addZero(day);
    }

    function addZero(number) {
      if (number >= 10) {
        return number + '';
      } else {
        return '0' + '' + number;
      }
    }

    NearByEguard.get({
      'longitude': user.longitude,
      'latitude': user.latitude,
    }, function(data) {
      $scope.eGuard = data.data;
      $scope.order.guard = data.data[0].id;
    }, function(data) {
      alert('NO DATA');
    });

    $scope.confirmOrder = function() {
      // if ($scope.order.receiverAddress === undefined || $scope.order.receiverAddress === '' || $scope.order.receiverAddress === '收货地址') {
      //   alert('请输入收货地址');
      //   return;
      // }
      var date = new Date();
      // var moment = addZero(date.getFullYear()) + '-' + addZero(date.getMonth()) + '-' + addZero(date.getDate()) + ' ' + addZero(date.getHours()) + ':' + addZero(date.getMinutes()) + ':' + addZero(date.getSeconds());
      var pDate = addDate(date, $scope.order.preferTimeDay);
      $scope.userPreferTime = [
        date.getFullYear() + '-' + pDate + ' ' + $scope.order.preferTimeTime.split(' -- ')[0] + ':00',
        date.getFullYear() + '-' + pDate + ' ' + $scope.order.preferTimeTime.split(' -- ')[1] + ':00'
      ];

      var orderIds = null;

      orderRequestObj = {
        url: 'http://www.lifeuxuan.com/backend/api/WashReserveOrderInsert.php',
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
          'username': user.username,
          'sellerId': $stateParams.shopId,
          'orderTime':'2016-07-04 19:00:40'
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
          console.log(e);
          console.log("error");
        })
        .always(function() {
          console.log("complete");
        });
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

    $scope.addCart = function(event, good) {
      event.stopPropagation();
      event.preventDefault();
      cartNumber = ShoppingCart.add(event, good);
      cartList();
    };

    $scope.removeCart = function(good) {
      event.stopPropagation();
      event.preventDefault();
      var cartNumber = ShoppingCart.remove(good);
      cartList();
    };
  })
})

;
