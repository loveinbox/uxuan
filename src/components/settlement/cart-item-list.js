angular.module('starter.directives')

.directive('cartItemList', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      isAllChecked: '='
    },
    templateUrl: './build/components/settlement/cart-item-list.html',
    controller: function($scope, $rootScope, $stateParams,
      ShoppingCart) {
      const type = $stateParams.type
      $scope.type = type
      $scope.order = {}
      if (type == 'wash' && isReserve) {
        $scope.order.carts = [];
      }

      $scope.order.isAllChecked = true;
      $scope.order.totalMoney = ShoppingCart.getTotalCartMoney(type);
      $scope.totalMoney = ShoppingCart.getTypeCartMoney({ type });

      $scope.$on('cartChange', function(event, data) {
        $scope.status.isGetThroesold = ShoppingCart.isGetThroesold(type);
        $scope.order.carts = ShoppingCart.getCart(type);
        $scope.order.totalMoney = ShoppingCart.getTotalCartMoney(type);
        judgeOrder();
      });

      $scope.pickShop = function(event, shop) {
        event.stopPropagation();
        ShoppingCart.checkShop(shop, type);
        $rootScope.$broadcast('cartChange');
      }

      $scope.pickShopGood = function(event, good, shop) {
        event.stopPropagation();
        ShoppingCart.checkShopGood(type, good, shop);
        $rootScope.$broadcast('cartChange');
      }

      $scope.pickAll = function() {
        ShoppingCart.checkAll($scope.order.isAllChecked, type);
        $rootScope.$broadcast('cartChange');
      }

    }
  }
})
