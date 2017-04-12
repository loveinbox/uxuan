angular.module('starter.directives')

.directive('uAddress', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      address: '='
    },
    templateUrl: './build/components/settlement/order-address.html',
    controller: function($scope, $q, $ionicPopup, UserInfo, isTooFar) {
      $scope.isAdddressAdded = false;
      $scope.$watch('address', function(nv) {
        if (nv && nv.rcvPhone) {
          $scope.isAdddressAdded = true;
        }
      })

      $scope.getAddress = function() {
        wx.ready(function() {
          wx.openAddress({
            success: function(res) {
              var addressGot = res.provinceName + res.cityName + res.countryName +
                res.detailInfo;
              $scope.$apply(function() {
                $scope.address.rcvAddress = addressGot;
                $scope.address.rcvName = res.userName;
                $scope.address.rcvPhone = res.telNumber + '';
                $scope.status.isAdded = true;
                isTooFar(addressGot).then(function() {
                  $scope.status.isAddressValidated = true;
                }, function() {
                  $scope.status.isAddressValidated = false;
                })
              })
            }
          });
        });
      }

    }
  }
})
