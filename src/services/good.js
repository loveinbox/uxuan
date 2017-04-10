angular.module('starter.controllers')

.controller('GoodDetailCtrl', function($rootScope, $scope, $stateParams, $state, $ionicHistory,
  $ionicModal, UserInfo, FruitDetail, FruitPicShow, ShoppingCart, FruitOrWash) {
  $scope.isHideAddCart = false;
  $scope.singleNumber = 0;

  UserInfo.then(function(user) {
    FruitOrWash.toFruit();
    FruitDetail.get({
      'longitude': user.longitude,
      'latitude': user.latitude,
      'productId': $stateParams.sessionId
    }, function(data) {
      $scope.good = data.data.product;
      $scope.shop = data.data.shop;
      $rootScope.$broadcast('cartChange');
      FruitPicShow.get({
        'longitude': user.longitude,
        'latitude': user.latitude,
        'productId': $stateParams.sessionId
      }, function(data) {
        $scope.imgs = data.data;
      });
    });

    $scope.$on('cartChange', function(event, data) {
      $scope.singleNumber = ShoppingCart.getGoodNumber($scope.good, $scope.shop);
      if ($scope.singleNumber > 0) {
        $scope.isHideAddCart = true;
      } else {
        $scope.isHideAddCart = false;
      }
    });

  })
})
