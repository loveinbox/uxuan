angular.module('starter.controllers')

.controller('AppCtrl', function($scope, $rootScope) {
  $scope.goTop = function() {
    $rootScope.$broadcast('goTop')
  }
});
