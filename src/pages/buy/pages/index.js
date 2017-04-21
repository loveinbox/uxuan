angular.module('starter.controllers')

.controller('BuyIndexCtrl', function($scope, $stateParams,
  UserInfo, FruitRank
) {
  $scope.flag = '星巴克摩卡（冷/中杯）1杯'

  UserInfo.then(function(user) {

    const baseData = {
      'longitude': user.longitude,
      'latitude': user.latitude
    }

    FruitRank.get(baseData, function(data) {
      $scope.buyRecords = data.data;
    });

    $scope.menu = [{
      key: 'food',
      name: '买吃的'
    }, {
      key: 'market',
      name: '超市代买'
    }, {
      key: 'fruit',
      name: '买水果'
    }, {
      key: 'coffee',
      name: '咖啡甜品'
    }, {
      key: 'veg',
      name: '买菜'
    }, {
      key: 'medical',
      name: '大药房'
    }, {
      key: 'cig',
      name: '买香烟'
    }, {
      key: 'care',
      name: '女性护理'
    }, {
      key: 'dot',
      name: '一点点'
    }, {
      key: 'brek',
      name: '买早餐'
    }, {
      key: 'catin',
      name: '便利店'
    }, {
      key: 'bread',
      name: '面包蛋糕'
    }, {
      key: 'more',
      name: '更多'
    }]

  })
});
