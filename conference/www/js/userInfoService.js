angular.module('starter.services')

.factory('userWechatInfo', function($resource) {
  return $resource('http://www.lifeuxuan.com/backend/userinfo.php');
})

.factory('userRegister', function($resource) {
  return $resource('http://www.lifeuxuan.com/backend/api/UserRegister.php');
})

.factory('Location', function($q) {

  console.log('start to get loction');
  var deferred = $q.defer();
  var userLocation = {
    'latitude': 31.199345,
    'longitude': 121.446322,
    'isOut': false,
    'isGet': true
  };

  var userLocation = JSON.parse(localStorage.getItem('userLocation')) || {
    'latitude': 121.446322,
    'longitude': 31.199345,
    'isOut': false,
    'isGet': true
  };

  if (userLocation.isSearchGeo) {
    GetAddress(userLocation.latitude, userLocation.longitude);
  } else {
    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function(r) {
      if (this.getStatus() == BMAP_STATUS_SUCCESS) {
        // alert('您的位置：' + r.point.lng + ',' + r.point.lat);
        userLocation.latitude = r.point.lat;
        userLocation.longitude = r.point.lng;
        GetAddress(userLocation.latitude, userLocation.longitude);
      } else {
        alert('failed' + this.getStatus());
      }
    }, {
      enableHighAccuracy: true
    })
  }

  function GetAddress(lat, lng) {
    point = new BMap.Point(lng, lat);
    var gc = new BMap.Geocoder();
    gc.getLocation(point, function(rs) {
      var addComp = rs.addressComponents;
      userLocation.province = addComp.province;
      userLocation.city = addComp.city;
      userLocation.district = addComp.district;
      userLocation.street = addComp.street;
      userLocation.streetNumber = addComp.streetNumber;
      if (addComp.city != '上海市') {
        userLocation.isOut = true;
      } else {
        userLocation.isOut = false;
      }
      userLocation.isSearchGeo = false;
      localStorage.setItem('userLocation', JSON.stringify(userLocation));
      deferred.resolve(userLocation);
    });
  }

  deferred.resolve(userLocation);
  return deferred.promise;
})

.factory('UserInfo', function($resource, $q, $timeout, userWechatInfo, userRegister, Location) {
  var deferred = $q.defer();
  var user = {
    'name': 'test',
    'userId': '22',
    'latitude': 31.199345,
    'longitude': 121.446322,
    'openId': '',
    'username': '',
    'password': '',
    'headPicUrl': '',
    'phoneNumber': '18788889999',
    'verify': 1,
    'addressInfo': {}
  }
  Location.then(function(userLocation) {
    // user default value
    user.latitude = userLocation.latitude;
    user.longitude = userLocation.longitude;
    user.userLocation = userLocation;

    // ------------for test-----------------
    // $timeout(function (){
    deferred.resolve(user)
      // }) ;
      // ------------for test-----------------

    userWechatInfo.get({}, function(e) {
      user.name = e.nickname;
      user.img = e.headimgurl;
      user.openid = e.openid;
      if (user.name == '哈库那玛塔塔') {
        screenLog.init({ autoScroll: false });
      }
      console.log('user get');
      userRegister.get({
        'latitude': user.latitude,
        'longitude': user.longitude,
        'openId': e.openid,
        'username': e.nickname,
        'password': '',
        'headPicUrl': e.headimgurl
      }, function(e) {
        if (e.data) {
          user.userId = e.data.userId;
          user.verify = e.data.verify;
          user.addressInfo = e.data.addressInfo;
          console.log('user userRegister');
          deferred.resolve(user);
        }
      })
    });
  })

  return deferred.promise;
})

.factory('WxLocation', function($q) {
  var deferred = $q.defer();
  var userWxLocation = {};

  function getAddress() {
    wx.ready(function() {
      wx.openAddress({
        success: function(res) {
          var addressGot = res.provinceName + res.cityName + res.countryName + res.detailInfo;
          $scope.$apply(function() {
            if (isTooFar(addressGot)) {
              alert('输入的地址超出配送范围，请重新选择');
            }
            userWxLocation.receiverAddress = addressGot || '';
            userWxLocation.receiverName = res.userName;
            userWxLocation.receiverPhone = res.telNumber - 0;
            $rootScope.$broadcast('cartChange');
            deferred.resolve(userWxLocation);
          });
        },
        cancel: function() {
          alert("用户取消微信地址");
        }
      });
    });
  }

  function isTooFar(address) {
    var gc = new BMap.Geocoder();
    gc.getPoint(address, function(point) {
      var map = new BMap.Map("allmap");
      var pointA = new BMap.Point(user.longitude, user.latitude); // 创建点坐标A
      var pointB = new BMap.Point(point.lng, point.lat); // 创建点坐标B
      // alert('两点的距离是：' + (map.getDistance(pointA, pointB)).toFixed(2) + ' 米。'); //获取两点距离,保留小数点后两位
      var distacne = (map.getDistance(pointA, pointB)).toFixed(2);
      console.log('distacne', distacne);
      if (distacne > 6000) {
        return true;
      } else {
        return false;
      }
    });
  }

  return deferred.promise;
})



;
