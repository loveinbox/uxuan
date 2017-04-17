angular.module('starter.controllers')

.controller('CartCtrl', function($scope, $state, $stateParams,
  UserInfo, Address, ShoppingCart,
  FruitOrder, WashOrder, WashReserve) {
  const type = $stateParams.type
  const methodMap = {
    'wash': WashReserve,
    'wash-order': WashOrder,
    'fruit': FruitOrder
  }
  let insertMethod = methodMap[type];
  let orderData = {}

  $scope.address = Object.assign({}, Address)
  $scope.sendDate = {}
  $scope.sendTime = {}
  $scope.guard = {}
  $scope.sendDate = {}
  $scope.sendTime = {}
  $scope.totalMoney = ShoppingCart.getTypeCartMoney({ type });
  $scope.payButton = '微信支付'

  $scope.$on('cartChange', function(event, data) {
    $scope.totalMoney = ShoppingCart.getTypeCartMoney({ type });
  });

  UserInfo.then(function(user) {
    $scope.confirmOrder = function(event) {
      // if (!isOrderAvaliable()) {
      //   return;
      // } else {
      orderData = buildOrderData()
        // }
      debugger
      // insertMethod.save(orderData)
      //   .$promise
      //   .then(function(res) {
      //     if (isReserve) {
      //       alert('预约成功');
      //       $state.go('app.order-list');
      //     } else {
      //       // var data = res.data;
      //       // var payData = FruitOrWash.get() == 'furit' ? {
      //       //   'orderIdsList': data.orderIdsList,
      //       //   'orderType': 17001
      //       // } : {
      //       //   'orderIdsList': data.orderIdsList,
      //       //   'orderType': 17002
      //       // };
      //       // payData.money = data.money;
      //       // WxPayParam.set(payData);
      //       // $state.go('pay');
      //     }
      //     ShoppingCart.cleanCart(type);
      //   })
      //   .catch(function(res) {
      //     alert('下订单失败');
      //     orderStatus.failed();
      //     $state.go('app.order-list');
      //   })
    }


    function isOrderAvaliable() {
      $scope.payButton = '微信支付';
      if (type == 'furit' && $scope.status.isGetThroesold == false) {
        $scope.payButton = '未达起送价';
        return false;
      }
      if (_.isEmpty($scope.address)) {
        $scope.payButton = '请添加收货地址';
        return false;
      }
      if (!$scope.address.isAddressValidated) {
        $scope.payButton = '请修改送货地址';
        return false;
      }
      if (type == 'wash') {
        $scope.payButton = '预约洗衣';
        return true;
      } else {
        if (!ShoppingCart.getCart(type).length) {
          $scope.payButton = '请添加商品';
          return false;
        } else {
          return true;
        }
      }
    }

    function buildOrderData() {
      var preferFullTime = [];
      var preferDate = $scope.sendDate.current;
      var preferTime = $scope.sendTime.current.split(' -- ')
      preferFullTime[0] = buildTime(preferDate + ' ' + preferTime[0])
      preferFullTime[1] = buildTime(preferDate + ' ' + preferTime[1])
      return {
        'latitude': user.longitude,
        'longitude': user.latitude,
        'userId': user.userId,
        'eguardId': $scope.guard.current.eguardId,
        'rcvName': $scope.address.rcvName,
        'rcvPhone': $scope.address.rcvPhone,
        'rcvAddress': $scope.address.rcvAddress,
        'preferRcvTime': [preferFullTime[0], preferFullTime[1]], //期望收货时间
        'preferFetchTime': [preferFullTime[0], preferFullTime[1]],
        'needTicket': false,
        'tip': '',
        'detail': ShoppingCart.getTypeCart({ type })
      };
    }

    function buildTime(time) {
      return new Date(time).getTime() / 1000
    }

  })
})
