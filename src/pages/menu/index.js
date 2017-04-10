angular.module('starter.controllers')

.controller('IndexCtrl', function($scope, $rootScope, $timeout,
  $ionicScrollDelegate, $ionicSlideBoxDelegate,
  UserInfo, BannerIndex, MainPageHot,
  NearByFruitShops, NearByWashShops, FruitRank, WashRank
) {
  $scope.location = {
    isGet: false,
    isOut: false,
    text: '定位中...'
  };
  UserInfo.then(function(user) {
    $scope.location = user.userLocation;
    if (user.userLocation.street) {
      $scope.location.text = user.userLocation.street;
    }
    $scope.$watch('user.userLocation', function() {
      if (user.userLocation.street) {
        $scope.location.text = user.userLocation.street;
      }
    }, true);

    const baseData = {
      'longitude': user.longitude,
      'latitude': user.latitude
    }

    MainPageHot.get(baseData, function(data) {
      // data.data.forEach(function(value) {
      //   if (value.productType == 17001) {
      //     value.href = '/sessions/' + value.productId;
      //   } else {
      //     value.href = '/washSingle/' + value.shopId;
      //   }
      // });
      $scope.hotList = data.data;
    });

    BannerIndex.get(baseData, function(data) {
      $scope.banners = data.data;
      $ionicSlideBoxDelegate.update();
      $ionicSlideBoxDelegate.loop(true);
    });

    NearByFruitShops.get(baseData, function(data) {
      $scope.FruitShops = data.data;
    });

    NearByWashShops.get(baseData, function(data) {
      $scope.WashShops = data.data;
    });

    FruitRank.get(baseData, function(data) {
      $scope.FruitRank = data.data;
    });

    WashRank.get(baseData, function(data) {
      $scope.WashRank = data.data;
    });

  })

  $timeout(function() {
    //return false; // <--- comment this to "fix" the problem
    var sv = $ionicScrollDelegate.$getByHandle('horizontal').getScrollView();

    var container = sv.__container;

    var originaltouchStart = sv.touchStart;
    var originalmouseDown = sv.mouseDown;
    var originaltouchMove = sv.touchMove;
    var originalmouseMove = sv.mouseMove;

    container.removeEventListener('touchstart', sv.touchStart);
    container.removeEventListener('mousedown', sv.mouseDown);
    document.removeEventListener('touchmove', sv.touchMove);
    document.removeEventListener('mousemove', sv.mousemove);


    sv.touchStart = function(e) {
      e.preventDefault = function() {}
      originaltouchStart && originaltouchStart.apply(sv, [e]);
    }

    sv.touchMove = function(e) {
      e.preventDefault = function() {}
      originaltouchMove && originaltouchMove.apply(sv, [e]);
    }

    sv.mouseDown = function(e) {
      e.preventDefault = function() {}
      originalmouseDown && originalmouseDown.apply(sv, [e]);
    }

    sv.mouseMove = function(e) {
      e.preventDefault = function() {}
      originalmouseMove && originalmouseMove.apply(sv, [e]);
    }

    container.addEventListener("touchstart", sv.touchStart, false);
    container.addEventListener("mousedown", sv.mouseDown, false);
    document.addEventListener("touchmove", sv.touchMove, false);
    document.addEventListener("mousemove", sv.mouseMove, false);
  });

});
