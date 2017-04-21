angular.module('starter.controllers')

.controller('BuyOthersCtrl', function($scope, $stateParams, UserInfo, FruitRank) {
  const type = $stateParams.type
  $scope.moreAddress = ''
  $scope.address = {}
  $scope.sendDate = {}
  $scope.sendTime = {}
  $scope.guard = {}

  UserInfo.then(function(user) {
    const baseData = {
      'longitude': user.longitude,
      'latitude': user.latitude
    }

    FruitRank.get(baseData, function(data) {
      $scope.buyRecords = data.data;
    });
  })

  const flagMap = {
    'food': {
      name: '菠萝面包2个，蛋挞1盒',
      recommands: ['KFC', '西贝莜面', '周黑鸭', '面包', '零食', '牛蛙面']
    },
    'market': {
      name: '老坛酸菜泡面一桶，泡面搭档一袋',
      recommands: ['酱油', '泡面', '花生', '洗发水', '姨妈巾', '大米']
    },
    'fruit': {
      name: '梨子一斤，香蕉2斤',
      recommands: ['苹果', '提子', '菠萝', '牛油果', '香蕉', '西瓜']
    },
    'coffee': {
      name: '奶茶1杯，满记甜品芒果班戳一份',
      recommands: ['哈根达斯', '满记甜品', '咖啡', '啤酒', '雪糕', '果汁']
    },
    'veg': {
      name: '青菜两斤，白菜2斤，土豆2斤',
      recommands: ['青菜', '牛骨头', '猪肉糜', '粉丝', '土豆', '白菜']
    },
    'medical': {
      name: '温度计一支',
      recommands: ['感冒灵', '治拉肚子的', '云南白药', '毓婷', '治头疼的', '开塞露']
    },
    'cig': {
      name: '一包软中华，打火机一支',
      recommands: ['中华', '黄鹤楼', '利群', '1条', '打火机', '七星爆珠']
    },
    'care': {
      name: '化妆棉一包，化妆液一瓶',
      recommands: ['化妆棉', '苏菲', '棉签', '七度空间', '护理液', '高洁丝']
    },
    'dot': {
      name: '波霸奶茶一杯，海盐玛奇朵一杯',
      recommands: ['波霸奶茶', '波霸奶绿', '盐买奶茶', '乌龙拿铁', '乌龙玛奇朵', '半塘']
    },
    'brek': {
      name: '小桃园淡浆一份，蛋饼2份加火腿',
      recommands: ['小桃园', '张记油条', '桃园眷村', 'KFC早餐', '麦当劳', '葱油饼']
    },
    'catin': {
      name: '全家麻辣肥牛便当一份，味全一瓶',
      recommands: ['味全果汁', '面包', '茶叶蛋', '包子', '关东煮', '便当']
    },
    'bread': {
      name: '红宝石奶油小方一份，芝士蛋糕一份',
      recommands: ['巴黎贝甜', '早安，巴黎', '85度C', '面包新语', '静安面包坊', '凯司令']
    },
    'more': {
      name: '海底捞锅底一份，调料8份',
      recommands: ['买文具', '买酒', '买板栗', '买盆栽', '买乒乓球', '买火锅调料']
    }
  }
  $scope.flag = flagMap[type].name
  $scope.recommands = flagMap[type].recommands
});
