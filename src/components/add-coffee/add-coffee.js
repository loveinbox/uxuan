angular.module('starter.directives')

.directive('addCoffee', function() {
  return {
    restrict: 'E',
    scope: {
      type: '=',
      shop: '=',
      good: '='
    },
    templateUrl: './build/components/add-coffee/add-coffee.html',
    controller: function($scope, $rootScope, $ionicModal, ShoppingCart, UserInfo) {
      UserInfo.then(function(user) {
        $scope.addCart = function(event, good, shop) {
          // if (!(user.verify - 0)) {
          //   $state.go('phoneNumberCheck');
          //   return;
          // }
          Object.assign($scope.good, $scope.selected)
          ShoppingCart.addItem({
            type: $scope.type,
            good: $scope.good,
            shop: $scope.shop
          });
        };
        $scope.removeCart = function(event, good, shop) {
          Object.assign($scope.good, $scope.selected)
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

      $scope.tempratureList = [{ name: '冷', id: 123 }, { name: '热', id: 456 }]
      $scope.cupList = [{ name: '中杯', id: 123 }, { name: '大杯', id: 456 }, { name: '超大杯', id: 789 }]
      $scope.selected = {
        temprature: { name: '冷', id: 123 },
        cup: { name: '中杯', id: 123 },
        number: 1
      }
      $ionicModal.fromTemplateUrl('./build/components/add-coffee/modal-coffee.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.hide();
      });

      $scope.pickTemprature = function(temprature, event) {
        event.stopPropagation()
        $scope.selected.tempratureId = temprature.id
      }
      $scope.pickCup = function(cup, event) {
        event.stopPropagation()
        $scope.selected.cupId = cup.id
      }

      $scope.openModal = function() {
        $scope.selected = {
            tempratureId: 123,
            cupId: 123,
            number: 1
          }
          // if ($scope.totalNumber > 0) {
        $scope.modal.show();
        //   $scope.cartGoods = ShoppingCart.getshopProductList($scope.shop.shopId, type);
        // }
      };
      $scope.closeModal = function() {
        $scope.modal.hide();
      };
      $scope.$on('$destroy', function() {
        $scope.modal.remove();
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

;
