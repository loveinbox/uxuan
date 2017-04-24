angular.module('starter.controllers')

.controller('orderDetailCtrl', function($scope, $rootScope, $stateParams, $state, UserInfo, StartPrice,
  FruitOrderDetail, WashOrderDetail, CoffeeOrderDetail) {
  const type = $stateParams.type;
  const detailMethodMap = {
    17001: FruitOrderDetail,
    17002: WashOrderDetail,
    17003: CoffeeOrderDetail
  }
  $scope.type = type
  UserInfo.then(function(user) {
    getOrder();

    function getOrder() {
      detailMethodMap[type].get({
        'longitude': user.longitude,
        'latitude': user.latitude,
        'orderId': $stateParams.orderId
      }, function(data) {
        $scope.order = data.data;
        let orderStage = data.data.orderStatusId
        if (orderStage - 0 <= 11003) {
          setStage([1]);
          return;
        }
        if (orderStage - 0 < 11008) {
          setStage([0, 1]);
          return;
        }
        if (orderStage - 0 < 11012) {
          setStage([0, 0, 1]);
          return;
        }
        if (orderStage - 0 <= 11015) {
          setStage([0, 0, 0, 1]);
          return;
        }
      });
    }

    $scope.clickPrice = function(event, order) {
      event.stopPropagation();
      event.preventDefault();
      StartPrice.save({
          orderId: order.orderId
        })
        .$promise
        .then(function(res) {
          if (res.code === 0) {
            $state.go('washSingleOrder', { shopId: order.shopId, orderId: order.orderId });
          }
        });
    }
  })

  function setStage(array) {
    $scope.stage01 = (array[0] === 1);
    $scope.stage02 = (array[1] === 1);
    $scope.stage03 = (array[2] === 1);
    $scope.stage04 = (array[3] === 1);
  }
})
