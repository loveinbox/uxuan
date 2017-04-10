angular.module('starter.controllers')

.controller('SearchCtrl', function($scope, UserInfo, Search) {

  $scope.search = {};
  $scope.search.keyword = '';
  UserInfo.then(function(user) {
    $scope.searchGo = function(e, order) {
      Search.get({
        'latitude': user.latitude,
        'longitude': user.longitude,
        'keyword': $scope.search.keyword
      }, function(e) {
        if (e.data) {
          $scope.goodsOfWash = e.data.productsList['wash'];
          $scope.goodsOfFruit = e.data.productsList['fruit'];
          $scope.shopsOfWash = e.data.shopsList['wash'];
          $scope.shopsOfFruit = e.data.shopsList['fruit'];
        }
      })
    }
  })
})

;
