angular.module('starter.controllers')

.controller('CartCtrl', function($scope, $state, $q, $stateParams,
  UserInfo, ShoppingCart, FruitOrder, WashOrder, WashReserve) {
  const type = $stateParams.type
  const methodMap = {
    wash: WashReserve,
    'wash-order': WashOrder,
    fruit: FruitOrder
  }
  let insertMethod = methodMap[type];
  let orderData = {}
  $scope.isAllChecked = false;
  $scope.totalMoney = ShoppingCart.getTypeCartMoney({ type });
  $scope.payButton = '微信支付'

  UserInfo.then(function(user) {
    $scope.confirmOrder = function(event) {
      if (!isOrderAvaliable()) {
        return;
      } else {
        orderData = buildOrderData()
      }

      insertMethod.save(orderData)
        .$promise
        .then(function(res) {
          if (isReserve) {
            alert('预约成功');
            $state.go('app.order-list');
          } else {
            // var data = res.data;
            // var payData = FruitOrWash.get() == 'furit' ? {
            //   'orderIdsList': data.orderIdsList,
            //   'orderType': 17001
            // } : {
            //   'orderIdsList': data.orderIdsList,
            //   'orderType': 17002
            // };
            // payData.money = data.money;
            // WxPayParam.set(payData);
            // $state.go('pay');
          }
          ShoppingCart.cleanCart(type);
        })
        .catch(function(res) {
          alert('下订单失败');
          orderStatus.failed();
          $state.go('app.order-list');
        })
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
      return {
        'latitude': user.longitude,
        'longitude': user.latitude,
        'userId': user.userId,
        'eguardId': $scope.order.guard,
        'rcvName': $scope.order.user.rcvName || 'test',
        'rcvPhone': $scope.order.user.rcvPhone || '123',
        'rcvAddress': $scope.order.user.rcvAddress || 'test',
        'preferRcvTime': [moment($scope.order.sendTime[0]).unix(), moment($scope.order.sendTime[1]).unix()], //期望收货时间
        'preferFetchTime': [moment($scope.order.sendTime[0]).unix(), moment($scope.order.sendTime[1]).unix()],
        'needTicket': false,
        'tip': '',
        'detail': ShoppingCart.getCart(type)
      };
      // if (FruitOrWash.getParams().washOrder) {
      //   orderData.shopId = FruitOrWash.getParams().washOrder.shopId
      //   orderData.orderIdsList = [FruitOrWash.getParams().washOrder.orderId]
      // };
      // if (type == 'furit') {
      //   insertMethod = FruitOrderInsert;
      // } else {
      //   if (isReserve) {
      //     insertMethod = insertWashReserve;
      //   } else {
      //     insertMethod = insertWashOrder;
      //     orderData.detail = ShoppingCart.getCart(type)[0].productsList;
      //   }
      // }
    }

  })
})
