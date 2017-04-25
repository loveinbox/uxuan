angular.module('starter.services')

.factory('Location', function($q, $location) {
  const deferred = $q.defer();
  const userLocation = {
    latitude: $location.search().latitude,
    longitude: $location.search().longitude
  }

  if (userLocation.latitude) {
    GetAddress(userLocation.latitude, userLocation.longitude);
  } else {
    const geolocation = new BMap.Geolocation();
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
    const point = new BMap.Point(lng, lat);
    const gc = new BMap.Geocoder();

    gc.getLocation(point, function(rs) {
      const addComp = rs.addressComponents;
      userLocation.province = addComp.province;
      userLocation.city = addComp.city;
      userLocation.district = addComp.district;
      userLocation.street = addComp.street;
      userLocation.streetNumber = addComp.streetNumber;
      deferred.resolve(userLocation);
    });
  }

  return deferred.promise;
})

.factory('UserInfo', function($resource, $q, userWechatInfo, userRegister, Location, Address) {
  let deferred = $q.defer();
  let user = {
    latitude: 31.15609,
    longitude: 121.504683,
    userId: 'C0000000001',
    verifyCode: 1,
    userLocation: {
      latitude: 31.15609,
      longitude: 121.504683,
      isOut: false,
      isGet: true,
      text: '获取用户信息失败'
    }
  };

  Location.then(userLocation => {
    userWechatInfo.get({}, function(e) {
      if (!e || e.code !== 0) {
        deferred.resolve(user)
        return deferred.promise;
      }
      user.latitude = userLocation.latitude;
      user.longitude = userLocation.longitude;
      user.userLocation = userLocation;
      user.name = e.data.nickname;
      user.img = e.data.headimgurl;
      user.openid = e.data.openid;
      user.headPicUrl = e.data.headimgurl;
      userRegister.get({
        'latitude': user.latitude,
        'longitude': user.longitude,
        'openId': user.openid,
        'username': user.nickname,
        'password': '',
        'headPicUrl': user.headPicUrl
      }, function(res) {
        if (res.data) {
          const address = res.data.lastAddress;
          user.userId = res.data.userId;
          user.verify = res.data.verifyCode;
          user.rcvName = address.rcvName;
          user.rcvPhone = address.rcvPhone;
          user.rcvAddress = address.rcvAddress;
          Object.assign(Address, user)
          deferred.resolve(user);
        }
      })
    });
  })

  return deferred.promise;
})

;
