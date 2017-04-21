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
