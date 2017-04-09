angular.module('starter.directives')

.directive('eGuard', function() {
  return {
    restrict: 'E',
    replace: true,
    template: '<p>管家<strong>{{eGuard.eguardName}}</strong>为您服务</p>',
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
