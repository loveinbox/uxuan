angular.module('starter.directives')

.directive('goodList', function() {
  return {
    restrict: 'E',
    scope: {
      listData: '=',
      listType: '@',
      listTitle: '@'
    },
    templateUrl: './build/components/good-list/list.html',
    controler: function($scope) {
      if ($scope.listType === 'fruit') {
        $scope.goodHref = '/good/{{good.productId}}'
      }
      if ($scope.listType === 'wash') {
        $scope.goodHref = '/shop/wash/{{washGood.shopId}}'
      }
    }
  }
})
