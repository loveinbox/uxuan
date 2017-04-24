angular.module('starter.controllers')

.controller('wxPayCtrl', function($scope, $state, $stateParams,
  UserInfo, WxPay, WxPayConfirm) {
  UserInfo.then(function(user) {
    const orderType = $stateParams.type;
    const money = $stateParams.money;
    const orderIdsList = $stateParams.orderIdsList;
    const sendData = {
      orderType,
      money,
      orderIdsList,
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
                WxPayConfirm.save({ orderIdsList: orderIdsList })
                $state.go('app.order-list', null, { location: 'replace' });
              },
              cancel: function(res) {
                alert('下订单成功，等待支付')
                $state.go('app.order-list', null, { location: 'replace' })
              }
            });
          });
        }, function() {
          alert('支付异常')
          $state.go('app.order-list', { location: 'replace' })
        })
    }
  })
})
