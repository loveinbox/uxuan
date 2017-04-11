angular.module('starter.directives')

.directive('guardPick', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      guard: '='
    },
    templateUrl: './build/components/settlement/guard-pick.html',
    controller: function($scope, NearByEguard, UserInfo) {
      UserInfo.then(function(user) {
        NearByEguard.get({
          'longitude': user.longitude,
          'latitude': user.latitude,
        }, function(data) {
          $scope.guards = data.data;
        }, function(data) {
          alert('NO DATA');
        });
      })
    }
  }
})
