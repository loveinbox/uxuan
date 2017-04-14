angular.module('starter.directives', [])

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
        $scope.totalNumber = ShoppingCart.getshopCartNumber($scope.shop.shopId, $scope.type);
        $scope.totalMoney = ShoppingCart.getshopCartMoney($scope.shop.shopId, $scope.type);
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
    controller: function($scope, $rootScope, $state, ShoppingCart, UserInfo) {
      // $scope.cartAction = {};
      // if ($scope.good) {
      //   $scope.cartAction.singleNumber = ShoppingCart.getGoodNumber($scope.good, $scope.shop,
      //     type);
      // }
      // UserInfo.then(function(user) {
      //   $scope.$on('cartChange', function(event, data) {
      //     $scope.cartAction.singleNumber = ShoppingCart.getGoodNumber($scope.good,
      //       $scope.shop, type);
      //   });
      //   $scope.addCart = function(event, good, shop) {
      //     event.stopPropagation();
      //     // console.log('1-->', user.verify);
      //     if (!(user.verify - 0)) {
      //       $state.go('phoneNumberCheck');
      //       return;
      //     }
      //     ShoppingCart.add(event, good, shop, type);
      //     $rootScope.$broadcast('cartChange');
      //   };

      //   $scope.removeCart = function(good, shop) {
      //     event.stopPropagation();
      //     ShoppingCart.remove(good, shop, type);
      //     $rootScope.$broadcast('cartChange');
      //   };
      // })
    }
  }
})

;
