angular.module('starter.directives')

.directive('payOrder', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      order: '='
    },
    transclude: true,
    template: '<button ng-click="rePay($event, order)" ng-transclude></button>',
    controller: function($scope, WxPayParam, $state) {
      $scope.rePay = function(event, order) {
        event.stopPropagation();
        event.preventDefault();
        var data = order.orderType === 17001 ? {
          'orderIdsList': [order.orderId],
          'orderType': 17001
        } : {
          'orderIdsList': [order.orderId],
          'orderType': 17002
        };
        data.money = order.money;
        WxPayParam.set(data);
        $state.go('pay');
      }
    }
  }
})

.directive('addCart', function() {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'templateDirectives/addCart.html',
    controller: function($scope, $rootScope, ShoppingCart, UserInfo) {
      $scope.$on('cartChange', function(event, data) {
        $scope.singleNumber = ShoppingCart.getGoodNumber($scope.good, $scope.shop);
        if ($scope.singleNumber > 0) {
          $scope.isHideAddCart = true;
        } else {
          $scope.isHideAddCart = false;
        }
      });
      UserInfo.then(function(user) {
        if ($scope.singleNumber > 0) {
          $scope.isHideAddCart = true;
        }
        $scope.addCart = function(event, good, shop) {
          event.stopPropagation();
          // console.log('1-->', user.verify);
          if (!(user.verify - 0)) {
            $state.go('phoneNumberCheck');
            return;
          }
          ShoppingCart.add(event, good, shop);
          $rootScope.$broadcast('cartChange');
        };
      })
    }
  }
})

.directive('cartModalIcon', function() {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'templateDirectives/cartModalIcon.html',
    controller: function($scope, $rootScope, $ionicModal, ShoppingCart, FruitOrWash) {
      var type = FruitOrWash.get();
      $scope.$on('cartChange', function(event, data) {
        $scope.totalNumber = ShoppingCart.getshopCartNumber($scope.shop.shopId, type);
        $scope.totalMoney = ShoppingCart.getshopCartMoney($scope.shop.shopId, type);
      });
      $ionicModal.fromTemplateUrl('templateDirectives/cartModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.hide();
      });
      $scope.openModal = function() {
        if ($scope.totalNumber > 0) {
          $scope.modal.show();
          $scope.cartGoods = ShoppingCart.getshopProductList($scope.shop.shopId, type);
        }
      };
      $scope.closeModal = function() {
        $scope.modal.hide();
      };
    }
  }
})

.directive('singleCart', function() {
  return {
    restrict: 'A',
    templateUrl: 'templateDirectives/singleCart.html',
    controller: function($scope, $rootScope, $state, ShoppingCart, UserInfo, FruitOrWash) {
      var type = FruitOrWash.get();
      $scope.cartAction = {};
      if ($scope.good) {
        $scope.cartAction.singleNumber = ShoppingCart.getGoodNumber($scope.good, $scope.shop,
          type);
      }
      UserInfo.then(function(user) {
        $scope.$on('cartChange', function(event, data) {
          $scope.cartAction.singleNumber = ShoppingCart.getGoodNumber($scope.good,
            $scope.shop, type);
        });
        $scope.addCart = function(event, good, shop) {
          event.stopPropagation();
          // console.log('1-->', user.verify);
          if (!(user.verify - 0)) {
            $state.go('phoneNumberCheck');
            return;
          }
          ShoppingCart.add(event, good, shop, type);
          $rootScope.$broadcast('cartChange');
        };

        $scope.removeCart = function(good, shop) {
          event.stopPropagation();
          ShoppingCart.remove(good, shop, type);
          $rootScope.$broadcast('cartChange');
        };
      })
    }
  }
})

;
