angular.module('starter.directives', [])

// .directive('addCart', function() {
//   return {
//     restrict: 'A',
//     replace: true,
//     // scope: {
//     //   gParamId: '@'
//     // },
//     templateUrl: './build/components/add-cart/add-cart.html',
//     controller: function($scope, $rootScope, ShoppingCart, UserInfo) {
//       $scope.$on('cartChange', function(event, data) {
//         $scope.singleNumber = ShoppingCart.getGoodNumber($scope.good, $scope.shop);
//         if ($scope.singleNumber > 0) {
//           $scope.isHideAddCart = true;
//         } else {
//           $scope.isHideAddCart = false;
//         }
//       });
//       UserInfo.then(function(user) {
//         if ($scope.singleNumber > 0) {
//           $scope.isHideAddCart = true;
//         }
//         $scope.addCart = function(event, good, shop) {
//           event.stopPropagation();
//           // console.log('1-->', user.verify);
//           if (!(user.verify - 0)) {
//             $state.go('phoneNumberCheck');
//             return;
//           }
//           ShoppingCart.add(event, good, shop);
//           $rootScope.$broadcast('cartChange');
//         };
//       })
//     }
//   }
// })

.directive('cartModal', function() {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: './build/components/add-cart/cartModalIcon.html',
    // controller: function($scope, $rootScope, $ionicModal, ShoppingCart, FuritOrWash) {
    //   var type = FuritOrWash.get();
    //   $scope.$on('cartChange', function(event, data) {
    //     $scope.totalNumber = ShoppingCart.getshopCartNumber($scope.shop.shopId, type);
    //     $scope.totalMoney = ShoppingCart.getshopCartMoney($scope.shop.shopId, type);
    //   });
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
    // }
  }
})

// .directive('singleCart', function() {
//   return {
//     restrict: 'A',
//     templateUrl: './build/components/add-cart/singleCart.html',
//     controller: function($scope, $rootScope, $state, ShoppingCart, UserInfo, FuritOrWash) {
//       var type = FuritOrWash.get();
//       $scope.cartAction = {};
//       if ($scope.good) {
//         $scope.cartAction.singleNumber = ShoppingCart.getGoodNumber($scope.good, $scope.shop,
//           type);
//       }
//       UserInfo.then(function(user) {
//         $scope.$on('cartChange', function(event, data) {
//           $scope.cartAction.singleNumber = ShoppingCart.getGoodNumber($scope.good,
//             $scope.shop, type);
//         });
//         $scope.addCart = function(event, good, shop) {
//           event.stopPropagation();
//           // console.log('1-->', user.verify);
//           if (!(user.verify - 0)) {
//             $state.go('phoneNumberCheck');
//             return;
//           }
//           ShoppingCart.add(event, good, shop, type);
//           $rootScope.$broadcast('cartChange');
//         };

//         $scope.removeCart = function(good, shop) {
//           event.stopPropagation();
//           ShoppingCart.remove(good, shop, type);
//           $rootScope.$broadcast('cartChange');
//         };
//       })
//     }
//   }
// })


.directive('goToCart', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: './build/components/add-cart/go-to-cart.html',
    controller: function($scope, $rootScope, $state, ShoppingCart, UserInfo) {
      $scope.type = 'wash-reserve';
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
