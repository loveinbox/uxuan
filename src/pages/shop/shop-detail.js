angular.module('starter.controllers')

.controller('ShopDetailCtrl', function($scope, $stateParams,
  UserInfo, FruitByShop, WashByShop, CoffeeByShop) {
  UserInfo.then(function(user) {
    const type = $stateParams.type
    const methodMap = {
      fruit: FruitByShop,
      wash: WashByShop,
      coffee: FruitByShop
    }
    methodMap[type].get({
      'shopId': $stateParams.shopId
    }, function(res) {
      $scope.shop = res.data.shop;
      $scope.goodList = res.data.productsList;
      $scope.classList = res.data.classifysList;
    });
  });
})
