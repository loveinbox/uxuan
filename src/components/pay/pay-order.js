angular.module('starter.directives')

.directive('payOrderLink', function() {
  return {
    restrict: 'E',
    scope: {
      order: '=',
    },
    template: '<div class="button button-small to-click" ng-click="goToPay($event)">支付订单</div>',
    controller: function($scope, $stateParams, $state) {
      $scope.goToPay = function(event) {
        event.preventDefault()
        event.stopPropagation()
        $scope.order
        $state.go('pay', {
          orderType: $scope.order.orderType,
          orderIdsList: [{ orderId: $scope.order.orderId, orderTypeId: $scope.order.orderType }],
          money: $scope.order.money
        }, {
          location: 'replace'
        });
      }
    }
  }
})
