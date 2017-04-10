angular.module('starter.controllers')

.controller('ShopDetailCtrl', function($scope, $stateParams,
  FruitByShop, WashByShop, UserInfo) {
  UserInfo.then(function(user) {
    const type = $stateParams.type
    const method = type === 'fruit' ? FruitByShop : WashByShop
    $scope.type = type
    method.get({
      'shopId': $stateParams.shopId
    }, function(res) {
      $scope.shop = res.data.shop;
      $scope.goodList = res.data.productsList;
      $scope.classList = res.data.classifysList;
    });
  });
})
