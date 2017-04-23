angular.module('starter.directives')

.directive('uAddress', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      address: '='
    },
    templateUrl: './build/components/settlement/order-address.html',
    controller: function($scope, Address, isTooFar) {
      $scope.address.rcvName = Address.rcvName
      $scope.address.rcvPhone = Address.rcvPhone
      $scope.address.rcvAddress = Address.rcvAddress
    }
  }
})
