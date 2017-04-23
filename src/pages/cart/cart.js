angular.module('starter.controllers')

.controller('CartCtrl', function($scope, $state, $stateParams, $rootScope,
  UserInfo, Address, ShoppingCart, MoneyCart,
  FruitOrder, WashOrder, WashReserve) {
  const type = $stateParams.type
  const methodMap = {
    'wash': WashReserve,
    'wash-order': WashOrder,
    'fruit': FruitOrder
  }
  const insertMethod = methodMap[type];
  const isReserve = type === 'wash'
  const orderTypeMap = {
    'fruit': 17001,
    'wash-order': 17002
  }

  let orderData = {}

  $scope.type = type
  $scope.address = Object.assign({}, Address)
  $scope.sendDate = {}
  $scope.sendTime = {}
  $scope.guard = {}
  $scope.sendDate = {}
  $scope.sendTime = {}
  $scope.tip = '订单备注：'
  $scope.payButton = isReserve ? '确认预约' : '微信支付'
  cartReBuild()

  $scope.$on('cartChange', function(event, data) {
    cartReBuild()
  });

  $scope.pickAll = function() {
    ShoppingCart.checkAll({ type })
  }

  UserInfo.then(function(user) {
    $scope.confirmOrder = function(event) {
      // if (!isOrderAvaliable()) {
      //   return;
      // } else {
      orderData = buildOrderData()
        // }
      insertMethod.save(orderData)
        .$promise
        .then(function(res) {
          if (isReserve) {
            alert('预约成功');
            $state.go('app.order-list');
          } else {
            const data = res.data;
            const orderType = orderTypeMap[type]
            const orderIdsList = data.orderIdsList
            const money = data.money;
            $state.go('pay', {
              orderType,
              orderIdsList,
              money,
            });
          }
          ShoppingCart.cleanCart(type);
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
        'tip': $scope.tip,
        'detail': isReserve ? {} : ShoppingCart.getTypeCartCheckedProducts({ type }),
        'orderIdsList': $rootScope.orderIdsList
      };

      function buildTime(time) {
        return new Date(time).getTime() / 1000
      }
    }

  })

  function cartReBuild() {
    $scope.money = isReserve ? 0 : MoneyCart.getTypeMoney({ type })
    $scope.isAllChecked = ShoppingCart.getTypeCart({ type }).isAllChecked
  }
})
