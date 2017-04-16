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
      // $scope.address.name = 123
      // $scope.address.phone = 123
      // $scope.address.address = 123

      // $scope.$on('addressChange', function() {
      $scope.address.name = Address.name
      $scope.address.phone = Address.phone
      $scope.address.address = Address.address
      isTooFar(Address.address).then(function() {
        $scope.address.isValidated = true;
      }, function() {
        $scope.address.isValidated = false;
      })

      // })



      // $scope.getAddress = function() {
      //   wx.ready(function() {
      //     wx.openAddress({
      //       success: function(res) {
      //         var addressGot = res.provinceName + res.cityName + res.countryName +
      //           res.detailInfo;
      //         $scope.$apply(function() {
      //           $scope.address.rcvAddress = addressGot;
      //           $scope.address.rcvName = res.userName;
      //           $scope.address.rcvPhone = res.telNumber + '';
      //           $scope.status.isAdded = true;
      //           isTooFar(addressGot).then(function() {
      //             $scope.status.isAddressValidated = true;
      //           }, function() {
      //             $scope.status.isAddressValidated = false;
      //           })
      //         })
      //       }
      //     });
      //   });
      // }

    }
  }
})
