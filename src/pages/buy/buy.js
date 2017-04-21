angular.module('starter.controllers')

.controller('BuyCtrl', function($scope, $ionicScrollDelegate,
  UserInfo, FruitRank
) {
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
