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
    controller: function($scope, $state, $ionicModal, ShoppingCart, UserInfo) {
      UserInfo.then(function(user) {
        $scope.addCart = function(event, good, shop) {
          if (user.verifyCode !== 1) {
            $scope.modal.hide();
            $state.go('phoneCheck');
            return;
          }
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

      $scope.temperatureList = [{ name: '冷', id: 22001 }, { name: '热', id: 22002 }]
      $scope.cupList = [{
        name: '中杯',
        id: 23001
      }, {
        name: '大杯',
        id: 23002
      }, {
        name: '超大杯',
        id: 23003
      }]

      $ionicModal.fromTemplateUrl('./build/components/add-coffee/modal-coffee.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.hide();
      });

      $scope.pickTemprature = function(temperature) {
        $scope.selected.temperatureId = temperature.id
      }
      $scope.pickCup = function(cup) {
        $scope.selected.cupId = cup.id
      }

      $scope.openModal = function() {
        $scope.selected = {
          temperatureId: 22001,
          cupId: 23001,
          number: 1
        }
        $scope.modal.show();
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
