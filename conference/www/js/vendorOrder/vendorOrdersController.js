angular.module('starter.controllers')

.controller('vendorOrdersController', function($scope, UserInfo, VendorOrderList,
  VendorAction) {

  $scope.button = {
    isBlueShow: true,
    isRedShow: true,
    blueText: 'Blue',
    redText: 'Red'
  }

  UserInfo.then(function(user) {
    getOrders(user, 'new');
    $scope.clickBlue = function(order) {
      acceptOrderService.get({
        'longitude': user.longitude,
        'latitude': user.latitude,
        'orderId': order.orderId
      }, function(data) {
        $scope.orders = data.data;
        getOrders(user, 'new');
        alert('接单成功');
      })
    }

    $scope.clickRed = function(order) {
      rejectOrderService.get({
        'longitude': user.longitude,
        'latitude': user.latitude,
        'orderId': order.orderId
      }, function(data) {
        $scope.orders = data.data;
        getOrders(user, 'new');
        alert('拒单成功');
      })
    }

    $scope.toTimestamp = function(dataStr) {
      return new Date(dataStr).getTime();
    }

    $scope.toWeekCn = function(dataStr) {
      var index = new Date(dataStr).getDay();
      var transfer = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
      return transfer[index];
    }

    $scope.clickForOrders = function(type) {
      getOrders(user, type);
    }

    function getOrders(user, type) {
      VendorOrderList[type].get({
        'shopHostId': 'C0000000007',
        'pos': 0
      }, function(data) {
        $scope.orders = addStatus(data.data);
      })
    }

    function addStatus(dataArray) {
      dataArray.forEach(function(value, index) {
        value.isRedShow = false;
        value.isBlueShow = false;
        switch (value.orderStatusId) {
          case 14001:
            // value.isBlueShow = true;
            value.isRedShow = false;
            value.blueText = '开始洗衣';
            value.redText = '拒单';
            break;
          case 14002:
            value.isBlueShow = true;
            value.isRedShow = false;
            value.blueText = '开始洗衣';
            value.redText = 'Red';
            break;
          case 14004:
            value.isBlueShow = true;
            value.isRedShow = false;
            value.blueText = '正在清洗';
            value.redText = 'Red';
            break;
          case 14005:
            value.isBlueShow = true;
            value.isRedShow = false;
            value.blueText = '清洗完成';
            value.redText = '拒单';
            break;
        }
      })
      return dataArray;
    }

  })
})

;
