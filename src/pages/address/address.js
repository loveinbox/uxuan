angular.module('starter.controllers')

.controller('AddressCtrl', function($rootScope, $scope, $state, $stateParams, $q,
  $ionicPopup, $ionicHistory, Address, isTooFar) {
  const type = $stateParams.type
  $scope.tipText = type === 'new' ? '新增地址' : '修改地址'
  $scope.address = Object.assign({}, Address)

  $scope.confirmAddress = function() {
    if (judgeAddress()) {
      Address.rcvName = $scope.address.rcvName
      Address.rcvPhone = $scope.address.rcvPhone
      if ($scope.address.rcvAddress.indexOf('上海市') < 0) {
        Address.rcvAddress = '上海市' + $scope.address.rcvAddress
      } else {
        Address.rcvAddress = $scope.address.rcvAddress
      }
      const $backView = $ionicHistory.backView();
      if ($backView) {
        $backView.go();
      } else {
        $state.go('app.index')
      }
    }
  }

  function judgeAddress() {
    let pass = true
    let message = ''
    if (!($scope.address.rcvName && $scope.address.rcvName.length > 0)) {
      pass = false
      message = '请填写姓名'
    }
    if (pass && !($scope.address.rcvPhone && $scope.address.rcvPhone > 1000000)) {
      pass = false
      message = '请填写完整手机号'
    }
    if (pass && !($scope.address.rcvAddress && $scope.address.rcvAddress.length >= 6)) {
      pass = false
      message = '请填写完整地址'
    }

    if (!pass) {
      $ionicPopup.alert({
        title: 'U选管家',
        template: message
      });
    }
    return pass
  }
})
