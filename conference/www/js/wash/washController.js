angular.module('starter.controllers')

.controller('washListCtrl', function($scope, UserInfo, getWashHot, getWashShops) {
  $scope.location = {};
  UserInfo.then(function(user) {
    getWashHot.get({
      'longitude': user.longitude,
      'latitude': user.latitude
    }, function(data) {
      $scope.sessions = data.data;
    }, function(data) {
      alert('NO DATA MainPageHot');
    });
    getWashShops.get({
      'longitude': user.longitude,
      'latitude': user.latitude,
      'shopId': 2
    }, function(data) {
      $scope.shops = data.data;
    }, function(data) {
      alert('NO DATA MainPageHot');
    });
  })
})

.controller('washSingleCtrl', function($scope, $stateParams, $timeout, $ionicScrollDelegate,
  UserInfo, getWashShop, FuritOrWash) {
  var scrollObj = {};
  var indexArray = [];
  $scope.currentIndex = 0;
  UserInfo.then(function(user) {
    getWashShop.get({
      'longitude': user.longitude,
      'latitude': user.latitude,
      'shopId': $stateParams.shopId
    }, function(res) {
      var count = 0;
      var lastId = -1;
      var indexCount = 0;
      $scope.shop = res.data.shop;
      $scope.goods = res.data.productsList;
      $scope.classes = res.data.classifysList;
      $scope.goods
        .forEach(function(el, index) {
          if (el.productClassifyId != lastId) {
            lastId = el.productClassifyId;
            scrollObj[el.productClassifyId] = count;
            indexArray[count] = indexCount++;
          }
          count++;
        });
      FuritOrWash.toWash(res.data.shop.shopId, null, true);
    }, function(data) {
      alert('NO DATA getWashShop');
    });
  });

  $scope.scrollTo = function(classifyId, index) {
    $scope.currentIndex = index;
    $ionicScrollDelegate.$getByHandle('wash-scroll').scrollTo(0, scrollObj[classifyId] * 80,
      true);
    $scope.getScrollPosition = null;
    $timeout(function() {
      $scope.getScrollPosition = getOffSet;
    }, 500);
  }
  $scope.getScrollPosition = getOffSet;

  function getOffSet() {
    var currentScroll = $ionicScrollDelegate.$getByHandle('wash-scroll').getScrollPosition().top;
    var getIndex = 0;
    for (var p in scrollObj) {
      if (scrollObj[p] * 80 < currentScroll) {
        getIndex = scrollObj[p];
        continue;
      }
    }
    console.log(getIndex);
    if ($scope.currentIndex !== indexArray[getIndex]) {
      $scope.currentIndex = indexArray[getIndex];
      $scope.getScrollPosition = null;
      $timeout(function() {
        $scope.getScrollPosition = getOffSet;
      }, 100);
    }
  }

})

// .controller('washCartCtrl', function($scope, $state, $stateParams, UserInfo, orderStatus,
//   NearByEguard, insertWashReserve) {
//   UserInfo.then(function(user) {
//     NearByEguard.get({
//       'longitude': user.longitude,
//       'latitude': user.latitude,
//     }, function(data) {
//       $scope.order.eGuards = data.data;
//       $scope.order.guard = data.data[0].eguardId;
//     }, function(data) {
//       alert('NO DATA');
//     });

//     $scope.order = {
//       user: user,
//       sendTime: [],
//       guard: 0
//     }

//     $scope.confirmOrder = function() {
//       // if ($scope.status.isGetThroesold !== true || $scope.status.isAddressValidated !== true) {
//       //   return;
//       // }

//       // 添加新订单
//       var orderData = {
//         'latitude': user.longitude,
//         'longitude': user.latitude,
//         'userId': user.userId,
//         'eguardId': $scope.order.guard,
//         'rcvName': $scope.order.user.name,
//         'rcvPhone': $scope.order.user.tel,
//         'rcvAddress': $scope.order.user.address,
//         'preferFetchTime': $scope.order.sendTime, //期望收货时间
//         'needTicket': false,
//         'tip': '',
//         'shopId': $stateParams.shopId
//       }
//       insertWashReserve.save(orderData)
//         .$promise
//         .then(function(res) {
//           if (res.code === 0) {
//             alert('预约成功！');
//             $state.go('app.orders');
//           } else {
//             alert('预约失败！');
//           }
//         });
//     }

//     $scope.getAddress = function() {
//       WxLocation.getAddress()
//         .then(function() {
//           orderRequestObj.receiverAddress = addressGot;
//           orderRequestObj.receiverName = res.userName;
//           orderRequestObj.receiverPhone = res.telNumber;
//         })
//     }
//   })
// })

.controller('washSingleOrderCtrl', function($scope, $stateParams, $rootScope, $ionicScrollDelegate,
  $ionicModal, UserInfo, getWashShop, ShoppingCart, FuritOrWash) {
  FuritOrWash.toWash($stateParams.shopId, $stateParams.orderId);
  var scrollObj = {};
  var indexArray = [];
  $scope.currentIndex = 0;
  UserInfo.then(function(user) {
    getWashShop.get({
      'longitude': user.longitude,
      'latitude': user.latitude,
      'shopId': $stateParams.shopId
    }, function(res) {
      var count = 0;
      var lastId = -1;
      var indexCount = 0;
      $scope.shop = res.data.shop;
      $scope.goods = res.data.productsList;
      $scope.classes = res.data.classifysList;
      $scope.goods
        .forEach(function(el, index) {
          if (el.productClassifyId != lastId) {
            lastId = el.productClassifyId;
            scrollObj[el.productClassifyId] = count;
            indexArray[count] = indexCount++;
          }
          count++;
        });
      $rootScope.$broadcast('cartChange');
    }, function(res) {
      alert('NO DATA getWashShop');
    });
  });

  $scope.scrollTo = function(classifyId, index) {
    $scope.currentIndex = index;
    $ionicScrollDelegate.$getByHandle('wash-scroll').scrollTo(0, scrollObj[classifyId] * 80,
      true);
    $scope.getScrollPosition = null;
    $timeout(function() {
      $scope.getScrollPosition = getOffSet;
    }, 500);
  }
  $scope.getScrollPosition = getOffSet;

  function getOffSet() {
    var currentScroll = $ionicScrollDelegate.$getByHandle('wash-scroll').getScrollPosition().top;
    var getIndex = 0;
    for (var p in scrollObj) {
      if (scrollObj[p] * 80 < currentScroll) {
        getIndex = scrollObj[p];
        continue;
      }
    }
    console.log(getIndex);
    if ($scope.currentIndex !== indexArray[getIndex]) {
      $scope.currentIndex = indexArray[getIndex];
      $scope.getScrollPosition = null;
      $timeout(function() {
        $scope.getScrollPosition = getOffSet;
      }, 100);
    }
  }
})

// .controller('washCartOrderCtrl', function($scope, $stateParams, $ionicHistory, $rootScope,
//   $location, $state, UserInfo, orderStatus, NearByEguard, FruitOrderInsert, PayConfirm, $http,
//   ShoppingCart) {})
