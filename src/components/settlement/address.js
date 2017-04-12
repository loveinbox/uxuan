angular.module('starter.directives')

.directive('uAddress', function() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      user: '='
    },
    transclude: true,
    template: `<div ng-click="getAddress()"><ng-transclude></ng-transclude></div>`,
    controller: function($scope, $q) {
      const user = $scope.user || {}
      if (user.rcvPhone) {
        $scope.status.isAdded = true;
        user.rcvName = user.rcvName;
        user.rcvPhone = user.rcvPhone;
        user.rcvAddress = user.rcvAddress;
      }

      isTooFar(user.rcvAddress).then(function() {
        $scope.status.isAddressValidated = false;
      }, function() {
        $scope.status.isAddressValidated = true;
      })

      $scope.getAddress = function(event) {
        wx.ready(function() {
          wx.openAddress({
            success: function(res) {
              var addressGot = res.provinceName + res.cityName + res.countryName +
                res.detailInfo;
              $scope.$apply(function() {
                user.rcvAddress = addressGot;
                user.rcvName = res.userName;
                user.rcvPhone = res.telNumber + '';
                $scope.status.isAdded = true;
                isTooFar(addressGot).then(function() {
                  $scope.status.isAddressValidated = false;
                }, function() {
                  $scope.status.isAddressValidated = true;
                })
              })
            }
          });
        });
      }

      $scope.showAlert = function() {
        var alertPopup = $ionicPopup.alert({
          title: 'U选到家',
          template: '收货地址超出您选择店面服务范围'
        });
      }

      function isTooFar(address) {
        var deferred = $q.defer();
        var gc = new BMap.Geocoder();
        address = address || '';
        gc.getPoint(address, function(point) {
          var map = new BMap.Map("allmap");
          var pointA = new BMap.Point(user.longitude, user.latitude); // 创建点坐标A
          var pointB = new BMap.Point(point.lng, point.lat); // 创建点坐标B
          var distacne = (map.getDistance(pointA, pointB)).toFixed(2);
          if (distacne > 6000) {
            $scope.showAlert()
            deferred.resolve(true);
          } else {
            deferred.reject(false);
          }
        });
        return deferred.promise;
      }
    }
  }
})
