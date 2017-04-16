angular.module('starter.controllers')

.controller('phoneNumberCheckCtrl', function($scope, $rootScope, $interval, UserInfo, SendCheckCode,
  CheckCheckCode, $ionicHistory, $state) {
  $scope.check = {
    time: 0
  };
  var timer = 0;

  UserInfo.then(function(user) {

    $scope.sendCode = function() {
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

    $scope.checkCode = function() {
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
        if (data.code == -1) {
          alert('验证失败');
          return;
        }
        user.verify = '1';
        $state.go('app.index');
      });
    }
  })


})
