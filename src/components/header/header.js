angular.module('starter.directives')

.directive('uHeader', function() {
  return {
    restrict: 'E',
    scope: {
      noBack: '=',
    },
    replace: true,
    templateUrl: './build/components/header/header.html'
  }
})

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

.directive('eGuard', function() {
  return {
    restrict: 'E',
    replace: true,
    template: '<p class="u-guard">管家<strong>{{eGuard.eguardName}}</strong>为您服务</p>',
    controller: function($scope, $rootScope, NearByEguard, Location, UserInfo) {
      UserInfo.then(function(user) {
        NearByEguard.get({
          'longitude': user.longitude,
          'latitude': user.latitude,
        }, function(data) {
          $rootScope.eGuard = data.data[0];
        }, function(data) {
          alert('NO DATA');
        });
      })
    }
  }
})
