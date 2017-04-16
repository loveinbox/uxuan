angular.module('starter.directives')

.directive('addCart', function() {
  return {
    restrict: 'E',
    scope: {
      type: '=',
      shop: '=',
      good: '=',
      cartType: '@'
    },
    templateUrl: './build/components/add-cart/add-cart.html',
    controller: function($scope, $state, ShoppingCart, UserInfo) {
      UserInfo.then(function(user) {
        $scope.addCart = function(event, good, shop) {
          if (user.verifyCode !== 1) {
            $state.go('phoneCheck');
            return;
          }
          ShoppingCart.addItem({
            type: $scope.type,
            good: $scope.good,
            shop: $scope.shop
          });
        };
        $scope.removeCart = function(event, good, shop) {
          ShoppingCart.removeItem({
            type: $scope.type,
            good: $scope.good,
            shop: $scope.shop
          });
        };
      })

      $scope.$watch('shop', function(value) {
        if (!value) {
          return
        } else {
          getGoodNumber();
        }
      })

      $scope.$on('cartChange', function(event) {
        getGoodNumber();
      });

      function getGoodNumber() {
        $scope.goodNumber = ShoppingCart.getGoodNumber({
          type: $scope.type,
          good: $scope.good,
          shop: $scope.shop
        });
      }

    }
  }
})
