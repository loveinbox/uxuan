angular.module('starter.controllers')

.controller('ShopListCtrl', function($scope, $stateParams, $ionicSlideBoxDelegate,
  UserInfo, NearByFruitShops, BannerFruit, FruitHot,
  NearByWashShops, BannerWash, WashHot) {
  const type = $stateParams.type
  const shopMethodMap = {
    fruit: NearByFruitShops,
    wash: NearByWashShops
  }
  const bannerMethodMap = {
    fruit: BannerFruit,
    wash: BannerWash
  }
  const hotMethodMap = {
    fruit: FruitHot,
    wash: WashHot
  }
  $scope.type = type
  UserInfo.then(function(user) {
    const baseData = {
      'longitude': user.longitude,
      'latitude': user.latitude
    }

    hotMethodMap[type].get(baseData, function(data) {
      $scope.hotList = data.data;
    });

    shopMethodMap[type].get(baseData, function(data) {
      $scope.shops = data.data;
    });

    bannerMethodMap[type].get(baseData, function(data) {
      $scope.banners = data.data;
      $ionicSlideBoxDelegate.update();
      $ionicSlideBoxDelegate.loop(true);
    });
  });

})
