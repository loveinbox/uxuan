angular.module('starter.controllers')

.controller('phoneNumberCheckCtrl', function($scope, $rootScope, $interval, UserInfo, SendCheckCode,
  CheckCheckCode, $ionicHistory, $state) {
  var e = {};
  $scope.check = {};
  $scope.check.time = 0;
  var timer = 0;

  UserInfo.then(function(user) {
    $scope.check.phoneNumber = localStorage.getItem('userPhone')
    $scope.$watch('check.phoneNumber', function(nv, ov) {
      if (nv) {
        localStorage.setItem('userPhone', nv);
      }
    })

    $scope.sendCode = function(e, order) {
      if ($scope.check.time > 0) {
        return;
      } else {
        $scope.check.time = 60;
      }
      SendCheckCode.get({
        'longitude': user.longitude,
        'latitude': user.latitude,
        'phone': $scope.check.phoneNumber
      }, function(data) {
        if (data.code == -1) {
          return;
        } else {
          alert('发送验证码成功');
        }
        timer = $interval(function() {
          $scope.check.time--;
          if ($scope.check.time < 0) {
            $interval.cancel(timer);
          }
        }, 1000);
      })
    }

    $scope.checkCode = function(e, order) {
      var phoneNumber = $scope.check.phoneNumber;
      if (!$scope.check.isAgree) {
        return;
      }
      CheckCheckCode.get({
        'longitude': user.longitude,
        'latitude': user.latitude,
        'phone': $scope.check.phoneNumber,
        'code': $scope.check.checkCode,
        'userId': user.userId
      }, function(data) {
        localStorage.removeItem('userPhone');
        // console.log(' checkcoode data.code', data.code);
        // console.log(' checkcoode data.msg', data.msg);
        if (data.code == -1) {
          alert('验证失败');
          return;
        }
        console.log('$scope.check.phoneNumber', phoneNumber);
        user.rdvPhone = $scope.check.phoneNumber;
        user.verify = '1';
        $state.go('app.sessions');
      });
    }
  })


})
