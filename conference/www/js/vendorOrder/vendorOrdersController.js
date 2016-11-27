angular.module('starter.controllers')

.controller('vendorOrdersCtrl', function($scope, UserInfo, VendorOrderList,
  VendorAction) {
  $scope.status = {
    now: 'new',
    new: 'new',
    process: 'process',
    finish: 'finish',
    noOrder: false
  }

  $scope.button = {
    isBlueShow: true,
    isRedShow: true,
    blueText: 'Blue',
    redText: 'Red'
  }

  var blueStatus2Action = {
    12001: 'accept',
    12004: 'fetch',
    12005: 'finish'
  }

  var redStatus2Action = {
    12001: 'refuse'
  }

  UserInfo.then(function(user) {
    getOrders();
    $scope.clickBlue = function(order) {
      EguardAction[blueStatus2Action[order.orderStatusId]].get({
        'orderId': order.orderId
      }, function(res) {
        if (res.code === 0) {
          alert('操作成功');
        } else {
          alert('操作失败！');
        }
        getOrders()
      })
    }
    $scope.clickRed = function(order) {
      VendorAction[redStatus2Action[order.orderStatusId]].get({
        'orderId': order.orderId
      }, function(res) {
        if (res.code === 0) {
          alert('操作成功');
        } else {
          alert('操作失败！');
        }
        getOrders()
      })
    }

    $scope.doRefresh = function() {
      getOrders();
      $scope.$broadcast('scroll.refreshComplete');
    }

    $scope.clickTab = function(type) {
      $scope.status.now = $scope.status[type];
      getOrders();
    }

    $scope.toTimestamp = function(dataStr) {
      return new Date(dataStr).getTime();
    }
    $scope.toWeekCn = function(dataStr) {
      var index = new Date(dataStr).getDay();
      var transfer = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
      return transfer[index];
    }

    function getOrders() {
      $scope.status.noOrder = false;
      VendorOrderList[$scope.status.now].get({
        'shopHostId': 'C0000000007',
        'pos': 0
      }, function(data) {
        $scope.orders = addStatus(data.data);
      })
    }

    function addStatus(dataArray) {
      if (!dataArray || dataArray.length == 0) {
        $scope.status.noOrder = true;
        console.log('NO DATA');
        return;
      }
      dataArray.forEach(function(value, index) {
        value.isRedShow = false;
        value.isBlueShow = false;
        switch (value.orderStatusId) {
          case 12001:
            value.isBlueShow = true;
            value.isRedShow = false;
            value.blueText = '接单';
            value.redText = '拒单';
            break;
          case 12004:
            value.isBlueShow = true;
            value.isRedShow = false;
            value.blueText = '取货';
            value.redText = 'Red';
            break;
          case 12005:
            value.isBlueShow = true;
            value.isRedShow = false;
            value.blueText = '已送达';
            value.redText = 'Red';
            break;
          case 13001:
            value.isBlueShow = true;
            value.isRedShow = false;
            value.blueText = '接单';
            value.redText = '拒单';
            break;
          case 13004:
            value.isBlueShow = true;
            value.isRedShow = false;
            value.blueText = '取衣';
            value.redText = 'Red';
            break;
          case 13007:
            value.isBlueShow = true;
            value.isRedShow = false;
            value.blueText = '送达洗衣店';
            value.redText = 'Red';
            break;
        }
      })
      return dataArray;
    }
  })
})

;
