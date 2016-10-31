angular.module('starter.services')

.controller('vendorOrdersController', function($scope, UserInfo, verndorList) {
  $scope.orderTypeObj = {
    10001: '水果',
    10002: '洗衣',
    10003: '星巴克',
    10004: '代买'
  }

  $scope.orderStatusObj = {
    7001: '处理中',
    7002: '出货中',
    7003: '派送中',
    7004: '已签收',
    7005: '已取消',
    7006: '已支付',
    7007: '未支付',
    7008: '预约中',
    7009: '已接单',
    7010: '已确认取货',
    7011: '已开始计价',
    7012: '订单被拒收',
    7013: '正在被送往商家途中',
    7014: '到达商家',
    7015: '清洗中',
    7016: '清洗完成'
  }

  UserInfo.then(function(user) {
    getOrders(user);

    $scope.acceptOrder = function(order) {
      acceptOrderService.get({
        'longitude': user.longitude,
        'latitude': user.latitude,
        'orderId': order.orderId
      }, function(data) {
        $scope.orders = data.data;
        getOrders(user);
        alert('接单成功');
      })
    }

    $scope.rejectOrder = function(order) {
      rejectOrderService.get({
        'longitude': user.longitude,
        'latitude': user.latitude,
        'orderId': order.orderId
      }, function(data) {
        $scope.orders = data.data;
        getOrders(user);
        alert('拒单成功');
      })
    }

    $scope.fetchClothes = function(order) {
      fetchClothesService.get({
        'longitude': user.longitude,
        'latitude': user.latitude,
        'orderId': order.orderId
      }, function(data) {
        $scope.orders = data.data;
      })
    }

    // $scope.rejectOrder = function() {
    //   acceptOrderService.get({
    //     'userId': '22'
    //   }, function(data) {
    //     $scope.orders = data.data;
    //   })
    // }

    function getOrders(user) {
      verndorList.get({
        'userId': user.userId
      }, function(data) {
        $scope.orders = data.data;
      })
    }

  })
})

// .controller('guardOrdersController', function($scope, getWashShop, $stateParams, UserInfo) {
//   UserInfo.then(function(user) {
//     getWashShop.get({
//       'longitude': user.longitude,
//       'latitude': user.latitude,
//       'sellerId': $stateParams.sellerId
//     }, function(data) {
//       $scope.seller = data.data.shop;
//       $scope.goods = getGoodQuuantity(data.data.shop.sellerId, data.data.products);
//       $scope.totalNumber = ShoppingCart.getSellerCartNumber($scope.seller.sellerId);
//     }, function(data) {
//       alert('NO DATA');
//     });
//   });
// })

;
