angular.module('starter.controllers')

.controller('guardOrdersController', function($scope, EguardNewOrderList, UserInfo) {
  UserInfo.then(function(user) {
    EguardNewOrderList.get({
      'userId': '22'
    }, function(data) {
      $scope.orders = data.data;
    })
  })
})

.controller('guardOrdersController', function($scope, getWashShop, UserInfo) {
  UserInfo.then(function(user) {
    getWashShop.get({
      'longitude': user.longitude,
      'latitude': user.latitude,
      'sellerId': $stateParams.sellerId
    }, function(data) {
      $scope.seller = data.data.shop;
      $scope.goods = getGoodQuuantity(data.data.shop.sellerId, data.data.products);
      $scope.totalNumber = ShoppingCart.getSellerCartNumber($scope.seller.sellerId);
    }, function(data) {
      alert('NO DATA');
    });
  });
})

;
