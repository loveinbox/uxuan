angular.module('starter.directives')

.directive('cartModal', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      type: '=',
      shop: '='
    },
    templateUrl: './build/components/cart-modal/cart-modal.html',
    controller: function($scope, $ionicModal, $timeout, ShoppingCart) {
      const type = $scope.type
      const shop = $scope.shop
      let time = 0

      $scope.$watch('shop', function(value) {
        if (!value) {
          return
        } else {
          getTypeCart();
        }
      })

      $scope.$on('cartChange', function(event, data) {
        getTypeCart();
        $timeout.cancel(time);
        $scope.seeing = true
        time = $timeout(function() {
          $scope.seeing = false
        }, 500)
      });

      function getTypeCart() {
        $scope.typeCartNumber = ShoppingCart.getTypeCartNumber({ type });
        $scope.typeCartMoney = ShoppingCart.getTypeCartMoney({ type });
      }

      $ionicModal.fromTemplateUrl('./build/components/cart-modal/cart-modal-list.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.hide();
      });
      $scope.stop = function(event) {
        event.stopPropagation()
      }

      $scope.openModal = function() {
        $scope.modal.show();
        $scope.cartGoods = ShoppingCart.getShopCartProductsList({
          type: type,
          shop: $scope.shop
        });
      };
      $scope.closeModal = function() {
        $scope.modal.hide();
      };
    }
  }
})
