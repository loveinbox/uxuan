angular.module('starter.controllers')

.controller('resetCtrl', function($scope, $stateParams, $state, resetShop, resetGuard, UserInfo) {
  var type = $stateParams.type;
  var method = type === 'guard' ? resetGuard : resetShop;
  var nameKey = type === 'guard' ? 'userId' : 'shopHostId';
  var order = type === 'guard' ? 'guard.order' : 'shop.order';
  $scope.input = {};
  UserInfo.then(function(user) {
    $scope.reset = function() {
      if ($scope.input.password !== $scope.input.passwordConfirm) {
        alert('两次输入的新密码不一致');
        return;
      }
      var data = {
        'eguardId': user.userId,
        'account': '',
        'rawPassword': $scope.input.oldPassword,
        'newPassword': $scope.input.password
      }
      method.save(data)
        .$promise
        .then(function(res) {
          if (res.code === 0) {
            alert(res.msg);
            $state.go(order)
          } else {
            alert(res.msg);
          }
        }, function(res) {
          alert('用户名/密码错误');
        })
    }
  })
})

.controller('loginCtrl', function($scope, $stateParams, $state, guardLogin, shopLogin, UserInfo) {
  UserInfo.then(function(user) {
    $scope.input = {};
    $scope.login = function() {
      var type = $stateParams.type;
      var method = type === 'guard' ? guardLogin : shopLogin
      var nameKey = type === 'guard' ? 'eguardId' : 'shopHostId'
      var data = {
        'account': $scope.input.username,
        'password': $scope.input.password
      }
      data[nameKey] = user.userId;
      method.get(data)
        .$promise
        .then(function(res) {
          if (res.code === 0) {
            $state.go('guard.order')
          } else {
            alert(res.msg);
          }
        }, function(res) {
          alert('用户名/密码错误');
        })
    }
  })
})

.controller('guardAccountCtrl', function($scope, $stateParams, UserInfo, guardAccount, shopAccount,
  guardNotices, shopNotices) {
  var type = $stateParams.type;
  var nameKey = type === 'guard' ? 'eguardId' : 'shopHostId'
  var method = type === 'guard' ? guardAccount : shopAccount
  var methodNotice = type === 'guard' ? guardNotices : shopNotices
  var data = {};
  UserInfo.then(function(user) {
    data[nameKey] = user.userId;
    method.get(data)
      .$promise
      .then(function(res) {
        $scope.user = res.data;
        $scope.status = { isChecked: eguardStatusId === 4001 };
        $scope.$watch($scope.status.isChecked, function() {
          if ($scope.status.isChecked == true) {
            guardWork.get({ 'eguardId': user.userId })
          } else {
            guardFree.get({ 'eguardId': user.userId })
          }
        })
      }, function(res) {
        // alert('用户名/密码错误');
      });
    methodNotice.get(data)
      .$promise
      .then(function(res) {
        $scope.notices = res.data;
      });
  })
})

.controller('guardFlowCtrl', function($scope, $stateParams, UserInfo, guardOrderFlow) {

  $scope.time = {
    start: new Date(moment().subtract(7, 'days')),
    end: new Date()
  }
  $scope.filterOrder = function() {
    getOrders();
  }
  getOrders();

  function getOrders() {
    guardOrderFlow.get({
      'eguardId': 'C0000000009',
      'timeZone': [moment($scope.time.start).format('YYYY-MM-DD'), moment($scope.time.end).format(
        'YYYY-MM-DD')]
    }, function(res) {
      $scope.flows = res.data;
    })
  }
})

.controller('guardOrdersCtrl', function($scope, UserInfo, EguardOrderList,
  EguardAction) {
  $scope.orderTypeObj = {
    17001: '水果',
    17002: '洗衣',
    17003: '星巴克',
    17004: '代买'
  }

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
    12005: 'finish',
    13001: 'acceptWash',
    13004: 'fetchWash',
    13007: 'finishWash'
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
      EguardAction[redStatus2Action[order.orderStatusId]].get({
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

    $scope.toWeekCn = function(dataStr) {
      var index = moment(dataStr).format('E');
      var transfer = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
      return transfer[index];
    }

    function getOrders() {
      $scope.status.noOrder = false;
      EguardOrderList[$scope.status.now].get({
        'eguardId': 'C0000000009',
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
