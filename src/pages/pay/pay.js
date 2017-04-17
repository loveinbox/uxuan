angular.module('starter.controllers')

.controller('wxPayCtrl', function($scope, $state, $stateParams,
  UserInfo, WxPay, WxPayConfirmWash, WxPayConfirmFruit) {
  UserInfo.then(function(user) {
    const orderType = $stateParams.type;
    const money = $stateParams.money;
    const orderIdsList = $stateParams.orderIdsList;
    const sendData = {
      orderType,
      money,
      orderIdsList,
    }
    const confirmMethodMap = {
      '17001': WxPayConfirmFruit,
      '17002': WxPayConfirmWash
    }

    $scope.pay = sendData

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
                confirmMethodMap[orderType].save({ 'orderIdsList': sendData.orderIdsList })
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
