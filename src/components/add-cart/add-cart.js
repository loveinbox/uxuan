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

;
