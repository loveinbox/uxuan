angular.module('starter.directives')

.directive('cartItemMoney', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      type: '=',
      shop: '='
    },
    templateUrl: './build/components/settlement/cart-item-money.html',
    controller: function($scope, MoneyCart) {
      $scope.money = MoneyCart.getShopMoney({
        type: $scope.type,
        shop: $scope.shop
      });

      $scope.$on('cartChange', function(event, data) {
        $scope.money = MoneyCart.getShopMoney({
          type: $scope.type,
          shop: $scope.shop
        });
      });
    }
  }
})
