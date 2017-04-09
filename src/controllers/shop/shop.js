angular.module('starter.controllers')

.controller('ShopListCtrl', function($scope, $rootScope, $stateParams, MainPageHot,
  NearByFruitShops, UserInfo, BannerFurit, $ionicSlideBoxDelegate, FuritOrWash) {
  $scope.location = {};
  UserInfo.then(function(user) {
    FuritOrWash.toFurit();
    MainPageHot.get({
      'longitude': user.longitude,
      'latitude': user.latitude,
    }, function(data) {
      $scope.sessions = data.data;
    });

    NearByFruitShops.get({
      'longitude': user.longitude,
      'latitude': user.latitude,
    }, function(data) {
      $scope.shops = data.data;
    });

    BannerFurit.get({
      'longitude': user.longitude,
      'latitude': user.latitude,
    }, function(data) {
      $scope.banners = data.data;
      $ionicSlideBoxDelegate.update();
      $ionicSlideBoxDelegate.loop(true);
    });
  });

})

.controller('ShopCtrl', function($scope, $stateParams, $ionicScrollDelegate, $timeout, $rootScope,
  FruitsByShop, ShoppingCart, $ionicModal, UserInfo, FuritOrWash) {
  var scrollObj = {};
  var indexArray = [];
  $scope.currentIndex = 0;

  UserInfo.then(function(user) {
    FuritOrWash.toFurit();
    FruitsByShop.get({
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
    // console.log(getIndex);
    if ($scope.currentIndex !== indexArray[getIndex]) {
      $scope.currentIndex = indexArray[getIndex];
      $scope.getScrollPosition = null;
      $timeout(function() {
        $scope.getScrollPosition = getOffSet;
      }, 100);
    }
  }

})
