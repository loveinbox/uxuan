angular.module('starter.directives')

.directive('addCart', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      type: '=',
      shop: '=',
      good: '=',
    },
    templateUrl: './build/components/add-cart/add-cart.html',
    controller: function($scope, $rootScope, ShoppingCart, UserInfo) {
      // $scope.$on('cartChange', function(event, data) {
      //   $scope.singleNumber = ShoppingCart.getGoodNumber($scope.good, $scope.shop);
      //   if ($scope.singleNumber > 0) {
      //     $scope.isHideAddCart = true;
      //   } else {
      //     $scope.isHideAddCart = false;
      //   }
      // });
      UserInfo.then(function(user) {
        // if ($scope.singleNumber > 0) {
        //   $scope.isHideAddCart = true;
        // }
        $scope.addCart = function(event, good, shop) {
          event.stopPropagation();
          // console.log('1-->', user.verify);
          // if (!(user.verify - 0)) {
          //   $state.go('phoneNumberCheck');
          //   return;
          // }
          ShoppingCart.addItem({
            type: $scope.type,
            good: $scope.good,
            shop: $scope.shop
          });
          $rootScope.$broadcast('cartChange');
        };
      })

      // cartFly(event);

      // function cartFly(event) {
      //   if ($(".icon-cart:visible").length < 1) {
      //     return;
      //   }
      //   let offset = $("#icon-cart-footer:visible").offset();
      //   let flyer = $('<i class="u-flyer icon ion-ios-color-filter"><i/>');
      //   flyer.fly({
      //     start: {
      //       left: event.pageX,
      //       top: event.pageY
      //     },
      //     end: {
      //       left: offset.left + 50,
      //       top: offset.top + 20,
      //       width: 0,
      //       height: 0
      //     },
      //     onEnd: function() {
      //       this.destory();
      //     }
      //   });
      // }

    }
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

;
