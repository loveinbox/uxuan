angular.module('starter.controllers')

.controller('wxPayCtrl', function($scope, $state, $stateParams, WxPayParam, UserInfo,
  orderStatus, WxPay, WxPayConfirmWash, WxPayConfirmFurit) {
  UserInfo.then(function(user) {
    $scope.$on("$ionicParentView.leave", function(event, data) {
      // console.log('loaded');
      localStorage.setItem('backForbidden', true);
    });
    var sendData = WxPayParam.get();
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
                orderStatus.paied();
                if (sendData.orderType == 17001) {
                  WxPayConfirmFurit.save({ 'orderIdsList': sendData.orderIdsList })
                } else {
                  WxPayConfirmWash.save({ 'orderIdsList': sendData.orderIdsList })
                }
                WxPayParam.set({});
                $state.go('app.orders');
              },
              cancel: function(res) {
                orderStatus.ordered();
                $state.go('app.orders')
              },
              complete: function(res) {

              }
            });
          });
        }, function() {
          alert('下订单成功，等待支付');
          orderStatus.ordered();
          $state.go('app.orders')
        })
    }
  })
})
