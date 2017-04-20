angular.module('starter.controllers')

.controller('BuyCtrl', function($scope, $rootScope, $timeout,
  $ionicScrollDelegate, $ionicSlideBoxDelegate,
  UserInfo, BannerIndex, MainPageHot,
  NearByFruitShops, NearByWashShops, FruitRank, WashRank
) {
  $scope.tip = '星巴克摩卡（冷/中杯）1杯'
  $scope.$on('goTop', function() {
    $ionicScrollDelegate.scrollTop(true)
  })

  UserInfo.then(function(user) {

    const baseData = {
      'longitude': user.longitude,
      'latitude': user.latitude
    }

    MainPageHot.get(baseData, function(data) {
      $scope.hotList = data.data;
    });

    BannerIndex.get(baseData, function(data) {
      $scope.banners = data.data;
      $ionicSlideBoxDelegate.update();
      $ionicSlideBoxDelegate.loop(true);
    });

    NearByFruitShops.get(baseData, function(data) {
      $scope.fruitShop = data.data;
    });

    NearByWashShops.get(baseData, function(data) {
      $scope.washShop = data.data;
    });

    FruitRank.get(baseData, function(data) {
      $scope.fruitRank = data.data;
    });

    WashRank.get(baseData, function(data) {
      $scope.washRank = data.data;
    });

  })
});

function auto_grow(element) {
  element.style.height = "5px";
  element.style.height = (25 + element.scrollHeight) + "px";
}
