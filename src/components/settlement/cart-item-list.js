angular.module('starter.directives')

.directive('cartItemList', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {},
    templateUrl: './build/components/settlement/cart-item-list.html',
    controller: function($scope, $rootScope, $stateParams, ShoppingCart, MoneyCart) {
      const type = $stateParams.type

      $scope.type = type
      $scope.order = {}
      $scope.carts = ShoppingCart.getShopCarts({ type })

      $scope.pickShop = function(event, shop) {
        event.stopPropagation();
        ShoppingCart.checkShop({ shop, type });
        $rootScope.$broadcast('cartChange');
      }

      $scope.pickShopGood = function(event, good, shop) {
        event.stopPropagation();
        ShoppingCart.checkGood({ type, good, shop });
        $rootScope.$broadcast('cartChange');
      }

      $scope.pickAll = function() {
        ShoppingCart.checkAll({ type });
        $rootScope.$broadcast('cartChange');
      }

    }
  }
})
