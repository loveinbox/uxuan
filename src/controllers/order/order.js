angular.module('starter.controllers')
  .controller('OrderStatusCtrl', function($scope, $stateParams, $ionicHistory, $rootScope,
    orderStatus) {
    var status = orderStatus.get();
    // console.log('111111111$rootScope.message', status);
    if (status == "ordered") {
      $scope.status = "下单成功,未支付";
      return;
    }
    if (status == "paied") {
      $scope.status = "支付成功";
      return;
    }
    $scope.status = "下单失败";
  })
