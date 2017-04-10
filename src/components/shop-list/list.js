angular.module('starter.directives')

.directive('shopList', function() {
  return {
    restrict: 'E',
    scope: {
      listData: '=',
      listType: '@',
      listTitle: '@'
    },
    templateUrl: './build/components/shop-list/list.html'
  }
})
