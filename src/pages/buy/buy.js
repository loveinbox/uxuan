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

    FruitRank.get(baseData, function(data) {
      $scope.buyRecords = data.data;
    });

  })
});

function auto_grow(element) {
  element.style.height = "5px";
  element.style.height = (25 + element.scrollHeight) + "px";
}
