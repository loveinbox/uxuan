angular.module('starter.controllers')

.controller('CartCtrl', function($scope, $state, $stateParams, $rootScope, $q,
  UserInfo, Address, ShoppingCart, MoneyCart, isTooFar,
  FruitOrder, WashOrder, WashReserve) {
  const type = $stateParams.type
  const methodMap = {
    'wash': WashReserve,
    'wash-order': WashOrder,
    'fruit': FruitOrder,
    'coffee': FruitOrder,
  }
  const insertMethod = methodMap[type];
  const isReserve = type === 'wash'
  const orderTypeMap = {
    'fruit': 17001,
    'wash-order': 17002
  }

  let orderData = {}

  $scope.type = type
  $scope.address = {}
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
    $scope.payButton = isReserve ? '确认预约' : '微信支付'
  });

  $scope.$on("$ionicView.enter", function(scopes, states) {
    $scope.address = Object.assign({}, Address)
  });

  $scope.pickAll = function() {
    ShoppingCart.checkAll({ type })
  }

  UserInfo.then(function(user) {
    $scope.confirmOrder = function(event) {
      orderData = buildOrderData()
      isOrderAvaliable(orderData).then(() => {
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
              }, {
                location: 'replace'
              });
            }
            ShoppingCart.cleanCart(type);
          })
      })
    }

    function isOrderAvaliable(orderData) {
      let deferred = $q.defer();
      let pass = true

      if (orderData.rcvPhone === '') {
        $scope.payButton = '请添加收货地址';
        pass = false;
      }
      if (orderData.detail.length === 0) {
        $scope.payButton = '请添加更多商品';
        pass = false;
      }
      if (pass) {
        isTooFar(orderData.rcvAddress)
          .then(function() {
            deferred.resolve();
          }, function() {
            deferred.reject();
          })
      } else {
        deferred.reject();
      }

      return deferred.promise;
    }

    function buildOrderData() {
      let preferFullTime = [];
      let preferDate = $scope.sendDate.current;
      let preferTime = $scope.sendTime.current.split(' -- ')
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
        'detail': buildOrderDetail(),
        'orderIdsList': $rootScope.orderIdsList
      };

      function buildOrderDetail() {
        let detail = []
        let carts = ShoppingCart.getShopCarts({ type })
        if (isReserve) {
          return detail
        }

        carts.forEach(shop => {
          let checkedGood = []
          if (!shop.showSendStartPrice) {
            shop.productsList.forEach(good => {
              if (good.isChecked) {
                checkedGood.push(good)
              }
            })
          }
          if (checkedGood.length > 0) {
            detail.push(Object.assign({}, shop, {
              productsList: checkedGood
            }))
          }
        })

        return detail
      }

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
