angular.module('starter.services')

.factory('Location', function($q, $location) {
  var deferred = $q.defer();
  var userLocation = {
    latitude: $location.search().latitude,
    longitude: $location.search().longitude
  }

  if (userLocation.latitude) {
    GetAddress(userLocation.latitude, userLocation.longitude);
  } else {
    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function(r) {
      if (this.getStatus() == BMAP_STATUS_SUCCESS) {
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
    var point = new BMap.Point(lng, lat);
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

  return deferred.promise;
})

.factory('UserInfo', function($resource, $q, userWechatInfo, userRegister, Location) {
  var deferred = $q.defer();
  var user = {}

  // for testing
  if (window.location.hostname == "localhost") {
    var user = {
      'latitude': 31.214197,
      'longitude': 121.496322,
      'isOut': false,
      'isGet': true,
      'text': '测试定位',
      'verifyCode': 1,
      userLocation: {
        'latitude': 31.214197,
        'longitude': 121.496322,
        'isOut': false,
        'isGet': true,
        'text': '测试定位'
      }
    };
    deferred.resolve(user);
    return deferred.promise;
  }

  Location.then(function(userLocation) {
    // user default value
    user.latitude = userLocation.latitude;
    user.longitude = userLocation.longitude;
    user.userLocation = userLocation;

    userWechatInfo.get({}, function(e) {
      user.name = e.data.nickname;
      user.img = e.data.headimgurl;
      user.openid = e.data.openid;
      user.headPicUrl = e.data.headimgurl;
      if (user.name == '哈库那玛塔塔') {
        // screenLog.init({ autoScroll: true });
      }
      userRegister.get({
        'userId': 'C0000000001',
        'latitude': user.latitude,
        'longitude': user.longitude,
        'openId': user.openid,
        'username': user.nickname,
        'password': '',
        'headPicUrl': user.headPicUrl
      }, function(res) {
        if (res.data) {
          Object.assign(user, res.data)
          deferred.resolve(user);
        }
      })
    });
  })

  return deferred.promise;
})

;
