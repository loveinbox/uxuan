angular.module('starter.directives')

.directive('goToCart', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      type: '=',
      shop: '=',
      isReserve: '='
    },
    templateUrl: './build/components/add-cart/go-to-cart.html',
  }
})

;
