angular.module('starter.directives')

.directive('goBack', function() {
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="back-wrap" ng-click="myGoBack()"> ' +
      '<i class="ion-arrow-left-c"></i><span>返回</span>' + '</div>',
    controller: function($scope, $state, $ionicHistory) {
      $scope.myGoBack = function() {
        const $backView = $ionicHistory.backView();
        if ($backView) {
          $backView.go();
        } else {
          $state.go('app.index')
        }
      };
    }
  }
})

.directive('uHeader', function() {
  return {
    restrict: 'E',
    scope: {
      hasBack: '=',
    },
    replace: true,
    templateUrl: './build/components/header/header.html'
  }
})
