angular.module('starter.controllers')

.controller('CartCtrl', function($scope, $rootScope, $state, $q, $stateParams,
  UserInfo, NearByEguard, ShoppingCart, WxPay,
  FruitOrder, WashOrder, WashReserve) {
  const type = $stateParams.type
  $scope.type = type
  let isReserve = false

  UserInfo.then(function(user) {
    // if (type == 'wash') {
    //   $scope.washOrder = FruitOrWash.getParams().washOrder;
    //   let isReserve = FruitOrWash.getParams().isReserve;
    // } else {
    //   isReserve = false;
    // }

    $scope.order = {
      user: user,
      sendTime: [],
      guard: 0,
      carts: ShoppingCart.getCart(type),
    }
    if (type == 'wash' && isReserve) {
      $scope.order.carts = [];
    }

    $scope.order.totalMoney = ShoppingCart.getTotalCartMoney(type);

    $scope.payButton = {
      text: '微信支付'
    }

    function judgeOrder() {
      $scope.payButton.text = '微信支付';
      if (type == 'furit' && $scope.status.isGetThroesold == false) {
        // alert('未达起送价');
        $scope.payButton.text = '未达起送价';
        return false;
      }
      if ($scope.status.isAdded == false) {
        // alert('请添加收货地址');
        $scope.payButton.text = '请添加收货地址';
        return false;
      }
      if ((type == 'furit' || !isReserve) && !$scope.order.carts.length) {
        // alert('请添加商品');
        $scope.payButton.text = '请添加商品';
        return false;
      }
      if (!$scope.status.isAddressValidated) {
        $scope.payButton.text = '请修改送货地址';
        return false;
      }
      if (isReserve) {
        $scope.payButton.text = '预约洗衣';
      } else {
        $scope.payButton.text = '微信支付';
      }
      return true;
    }
    $scope.confirmOrder = function(event) {
      if (!(user.verify - 0)) {
        $state.go('phoneNumberCheck');
        return;
      }
      event.stopPropagation();
      event.preventDefault();
      if (!judgeOrder()) {
        return;
      };

      var insertMethod = null;
      var orderData = {
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
      if (FruitOrWash.getParams().washOrder) {
        orderData.shopId = FruitOrWash.getParams().washOrder.shopId
        orderData.orderIdsList = [FruitOrWash.getParams().washOrder.orderId]
      };
      if (type == 'furit') {
        insertMethod = FruitOrderInsert;
      } else {
        if (isReserve) {
          insertMethod = insertWashReserve;
        } else {
          insertMethod = insertWashOrder;
          orderData.detail = ShoppingCart.getCart(type)[0].productsList;
        }
      }
      insertMethod.save(orderData)
        .$promise
        .then(function(res) {
          if (isReserve) {
            alert('预约成功');
            ShoppingCart.cleanCart(type);
            $state.go('app.orders');
          } else {
            var data = res.data;
            var sendData = FruitOrWash.get() == 'furit' ? {
              'orderIdsList': data.orderIdsList,
              'orderType': 17001
            } : {
              'orderIdsList': data.orderIdsList,
              'orderType': 17002
            };
            sendData.money = data.money;
            WxPayParam.set(sendData);
            ShoppingCart.cleanCart(type);
            $state.go('pay');
          }
        })
        .catch(function(res) {
          alert('下订单失败');
          orderStatus.failed();
          $state.go('app.orders');
        })
    }
  })
})
