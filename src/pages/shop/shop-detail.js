angular.module('starter.controllers')

.controller('ShopDetailCtrl', function($scope, $stateParams,
  UserInfo, FruitByShop, WashByShop, CoffeeByShop) {
  UserInfo.then(function(user) {
    const type = $stateParams.type
    const isReserve = type === 'wash'
    const methodMap = {
      fruit: FruitByShop,
      wash: WashByShop,
      'wash-order': WashByShop,
      coffee: CoffeeByShop
    }

    const requestData = {
      'longitude': user.longitude,
      'latitude': user.latitude,
      'shopId': $stateParams.shopId
    }

    $scope.isHideCart = isReserve
    $scope.isReserve = isReserve
    $scope.type = type
    methodMap[type].get(requestData, function(res) {
      $scope.shop = res.data.shop;
      $scope.goodList = res.data.productsList;
      $scope.classList = res.data.classifysList;
    });
  });
})
