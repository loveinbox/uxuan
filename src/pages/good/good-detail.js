angular.module('starter.controllers')

.controller('GoodDetailCtrl', function($scope, $stateParams,
  UserInfo, FruitDetail, FruitPicShow) {
  const goodId = $stateParams.goodId
  const type = $stateParams.type

  $scope.type = type

  UserInfo.then(function(user) {
    const data = {
      'longitude': user.longitude,
      'latitude': user.latitude,
      'productId': goodId
    }

    FruitDetail.get(data, function(res) {
      $scope.good = res.data.product;
      $scope.shop = res.data.shop;

      FruitPicShow.get(data, function(res) {
        $scope.imgs = res.data;
      });
    });

  })
})
