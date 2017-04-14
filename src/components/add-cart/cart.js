angular.module('starter.directives')

.directive('cartModal', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      type: '=',
      shop: '='
    },
    templateUrl: './build/components/add-cart/cart-modal.html',
    controller: function($scope, ShoppingCart) {

      $scope.$watch('shop', function(nv) {
        if (!nv) {
          return
        } else {
          getShopCart();
        }
      })

      $scope.$on('cartChange', function(event, data) {
        getShopCart();
      });

      function getShopCart() {
        $scope.totalNumber = ShoppingCart.getShopCartNumber({ type: $scope.type, shop: $scope.shop });
        $scope.totalMoney = ShoppingCart.getShopCartMoney({ type: $scope.type, shop: $scope.shop });
      }
      //   $ionicModal.fromTemplateUrl('./build/components/add-cart/cartModal.html', {
      //     scope: $scope,
      //     animation: 'slide-in-up'
      //   }).then(function(modal) {
      //     $scope.modal = modal;
      //     $scope.modal.hide();
      //   });
      //   $scope.openModal = function() {
      //     if ($scope.totalNumber > 0) {
      //       $scope.modal.show();
      //       $scope.cartGoods = ShoppingCart.getshopProductList($scope.shop.shopId, type);
      //     }
      //   };
      //   $scope.closeModal = function() {
      //     $scope.modal.hide();
      //   };
    }
  }
})

.directive('goToCart', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      type: '=',
      shop: '='
    },
    templateUrl: './build/components/add-cart/go-to-cart.html',
  }
})

;
