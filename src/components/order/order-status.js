angular.module('starter.controllers')

.controller('OrderStatusCtrl', function($scope, $stateParams) {
  const status = $stateParams.status
  switch (status) {
    case 'ordered':
      $scope.status = "下单成功，未支付";
      break;
    case 'paied':
      $scope.status = "支付成功";
      break;
    default:
      $scope.status = "下单失败";
      break;
  }
})
