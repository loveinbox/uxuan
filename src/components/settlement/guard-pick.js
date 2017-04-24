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
          $scope.guardList = data.data;
          $scope.eguardId = $scope.guardList[0].eguardId
          $scope.guard.eguardId = $scope.eguardId
        }, function(data) {
          alert('NO DATA');
        });
      })

      $scope.pickGuard = function(guard) {
        $scope.guard.eguardId = guard.eguardId
      }
    }
  }
})
