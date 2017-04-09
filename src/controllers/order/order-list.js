angular.module('starter.controllers')

.controller('OrderListCtrl', function($scope, $state, OrderList, UserInfo,
  StartPrice, cancelFurit, cancelWash) {

  UserInfo.then(function(user) {
    getOrders();

    $scope.doRefresh = function() {
      getOrders();
      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
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
            FuritOrWash.toWash(order, false);
            $state.go('washSingleOrder', { shopId: order.shopId, orderId: order.orderId });
          }
        });
    }

    $scope.clickRed = function(event, order) {
      event.stopPropagation();
      event.preventDefault();
      var cancelMethod = order.orderType == 17001 ? cancelFurit : cancelWash;
      cancelMethod.save({
          orderId: order.orderId
        })
        .$promise
        .then(function(res) {
          if (res.code === 0) {
            alert('取消成功');
            getOrders();
          }
        });
    }

    function getOrders() {
      OrderList.get({
        'customerId': user.userId,
        'pos': 0
      }, function(data) {
        $scope.orders = data.data;
      });
    }
  });
})

.controller('orderDetailCtrl', function($scope, $rootScope, $stateParams, FuritOrderDetail,
  WashOrderDetail, UserInfo, StartPrice, FuritOrWash, $state) {
  $scope.type = $stateParams.orderType;
  UserInfo.then(function(user) {
    getOrder();

    function getOrder(argument) {
      var detailMethod = $scope.type == 17001 ? FuritOrderDetail : WashOrderDetail;
      detailMethod.get({
        'longitude': user.longitude,
        'latitude': user.latitude,
        'orderId': $stateParams.orderId
      }, function(data) {
        $scope.order = data.data;
        var orderStage = data.data.orderStatusId
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
            FuritOrWash.toWash(order, true);
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
