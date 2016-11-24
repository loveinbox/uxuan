angular.module('starter.controllers')

.controller('guardOrdersController', function($scope, UserInfo, EguardOrderList,
  EguardAction) {
  $scope.orderTypeObj = {
    17001: '水果',
    17002: '洗衣',
    17003: '星巴克',
    17004: '代买'
  }

  // $scope.orderStatusObj = {
  //   7001: '处理中',
  //   7002: '出货中',
  //   7003: '派送中',
  //   7004: '已签收',
  //   7005: '已取消',
  //   7006: '已支付',
  //   7007: '未支付',
  //   7008: '预约中',
  //   7009: '已接单',
  //   7010: '已确认取货',
  //   7011: '已开始计价',
  //   7012: '订单被拒收',
  //   7013: '正在被送往商家途中',
  //   7014: '到达商家',
  //   7015: '清洗中',
  //   7016: '清洗完成'
  // }

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
      EguardOrderList[type].get({
        'eguardId': user.userId,
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
