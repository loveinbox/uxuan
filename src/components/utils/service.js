angular.module('starter')

.filter('toTimeStamp', function() {
  return function(input, param) {
    return moment(input).unix() * 1000;
  }
})

.filter('coffeeIdMapText', function() {
  const mapRule = {
    12: '冷',
    34: '热',
    56: '中杯',
    78: '大杯',
    90: '超大杯'
  }
  return function(input) {
    return mapRule[input];
  }
})

.factory('isTooFar', function() {
  return function isTooFar(address) {
    UserInfo.then(function(user) {
      var deferred = $q.defer();
      var gc = new BMap.Geocoder();
      address = address || '';
      gc.getPoint(address, function(point) {
        var map = new BMap.Map("allmap");
        var pointA = new BMap.Point(user.longitude, user.latitude); // 创建点坐标A
        var pointB = new BMap.Point(point.lng, point.lat); // 创建点坐标B
        var distacne = (map.getDistance(pointA, pointB)).toFixed(2);
        if (distacne > 6000) {
          showAlert()
          deferred.reject();
        } else {
          deferred.resolve();
        }
      });
      return deferred.promise;
    })

    function showAlert() {
      var alertPopup = $ionicPopup.alert({
        title: 'U选到家',
        template: '收货地址超出您选择店面服务范围'
      });
    }
  }
})
