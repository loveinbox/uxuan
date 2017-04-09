angular.module('starter.controllers')

.controller('washListCtrl', function($scope, UserInfo, getWashHot, getWashShops, BannerWash,
  $ionicSlideBoxDelegate, FuritOrWash) {
  $scope.location = {};
  UserInfo.then(function(user) {
    getWashHot.get({
      'longitude': user.longitude,
      'latitude': user.latitude
    }, function(data) {
      FuritOrWash.toWash();
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
    BannerWash.get({
      'longitude': user.longitude,
      'latitude': user.latitude,
    }, function(data) {
      $scope.banners = data.data;
      $ionicSlideBoxDelegate.update();
      $ionicSlideBoxDelegate.loop(true);
    }, function(data) {
      alert('NO DATA banners');
    });
  })
})

.controller('washSingleCtrl', function($scope, $stateParams, $timeout, $ionicScrollDelegate,
  $state, UserInfo, getWashShop, FuritOrWash) {
  var scrollObj = {};
  var indexArray = [];
  $scope.currentIndex = 0;
  UserInfo.then(function(user) {
    console.log(user.verify);
    getWashShop.get({
      'longitude': user.longitude,
      'latitude': user.latitude,
      'shopId': $stateParams.shopId
    }, function(res) {
      FuritOrWash.toWash();
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
      FuritOrWash.toWash($scope.shop, true);
    }, function(data) {
      alert('NO DATA getWashShop');
    });

    $scope.goCart = function() {
      if (!(user.verify - 0)) {
        $state.go('phoneNumberCheck');
        return;
      } else {
        $state.go('app.cart');
      }
    }
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

.controller('washSingleOrderCtrl', function($scope, $stateParams, $rootScope, $ionicScrollDelegate,
  $ionicModal, UserInfo, getWashShop, ShoppingCart, FuritOrWash) {
  var scrollObj = {};
  var indexArray = [];
  $scope.currentIndex = 0;
  UserInfo.then(function(user) {
    FuritOrWash.toWash(null, false);
    $scope.washOrder = FuritOrWash.getParams().washOrder;
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
