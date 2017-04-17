angular.module('starter.controllers')

.controller('wxPayCtrl', function($scope, $state, $stateParams, $location,
  UserInfo, WxPay, WxPayConfirmWash, WxPayConfirmFruit) {
  UserInfo.then(function(user) {
    var type = $location.search().type;
    var money = $location.search().money;
    var orderIdsList = $location.search().orderIdsList;
    var sendData = {
      type,
      money,
      orderIdsList,
    }

    $scope.pay = {
      money: sendData.money
    };

    $scope.payOrder = function() {
      WxPay.save(sendData)
        .$promise
        .then(function(res) {
          wx.ready(function() {
            wx.chooseWXPay({
              timestamp: res.timeStamp,
              nonceStr: res.nonceStr,
              package: res.package,
              signType: res.signType,
              paySign: res.paySign,
              success: function(res) {
                alert('支付成功');
                if (sendData.orderType == 17001) {
                  WxPayConfirmFruit.save({ 'orderIdsList': sendData.orderIdsList })
                } else {
                  WxPayConfirmWash.save({ 'orderIdsList': sendData.orderIdsList })
                }
                $state.go('app.order-list');
              },
              cancel: function(res) {
                alert('下订单成功，等待支付')
                $state.go('app.order-list')
              }
            });
          });
        }, function() {
          alert('支付异常')
          $state.go('app.order-list')
        })
    }
  })
})
