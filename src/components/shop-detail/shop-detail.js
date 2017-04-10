angular.module('starter.directives')

.directive('shopDetail', function() {
  return {
    restrict: 'E',
    scope: {
      img: '@',
      name: '@',
      time: '@',
      address: '@',
      tip: '@',
    },
    replace: true,
    templateUrl: './build/components/shop-detail/shop-detail.html',
    controller: function($scope) {
      $scope.img = $scope.img || 'http://lifeuxuan.com/images/washshopimage/WS0000005/1.jpg'
    }
  }
})
