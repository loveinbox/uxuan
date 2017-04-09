angular.module('starter.controllers')

.controller('IndexCtrl', function($scope, $rootScope, $timeout, MainPageHot, FruitUxuanRank,
  UserInfo, $ionicScrollDelegate, NearByFruitShops, getWashShops, getWashRank, BannerIndex,
  $ionicSlideBoxDelegate) {
  $scope.location = {
    isGet: false,
    isOut: false,
    text: '定位中...'
  };
  UserInfo.then(function(user) {
    $scope.location = user.userLocation;
    if (user.userLocation.street) {
      $scope.location.text = user.userLocation.street; // + user.userLocation.streetNumber;
    }
    $scope.$watch('user.userLocation', function() {
      if (user.userLocation.street) {
        $scope.location.text = user.userLocation.street; // + user.userLocation.streetNumber;
      }
    }, true);


    MainPageHot.get({
      'longitude': user.longitude,
      'latitude': user.latitude
    }, function(data) {
      data.data.forEach(function(value) {
        if (value.productType == 17001) {
          value.href = '/sessions/' + value.productId;
        } else {
          value.href = '/washSingle/' + value.shopId;
        }
      });
      $scope.sessions = data.data;
    }, function(data) {
      alert('NO DATA MainPageHot');
    });

    BannerIndex.get({
      'longitude': user.longitude,
      'latitude': user.latitude,
    }, function(data) {
      $scope.banners = data.data;
      $ionicSlideBoxDelegate.update();
      $ionicSlideBoxDelegate.loop(true);
    }, function(data) {
      alert('NO DATA banners');
    });

    FruitUxuanRank.get({
      'longitude': user.longitude,
      'latitude': user.latitude,
    }, function(data) {
      $scope.goods = data.data;
    }, function(data) {
      alert('NO DATA FruitUxuanRank');
    });

    NearByFruitShops.get({
      'longitude': user.longitude,
      'latitude': user.latitude,
    }, function(data) {
      $scope.shops = data.data;
    }, function(data) {
      alert('NO DATA NearByFruitShops');
    });

    getWashShops.get({
      'longitude': user.longitude,
      'latitude': user.latitude
    }, function(data) {
      $scope.washShops = data.data;
    }, function(data) {
      alert('NO DATA MainPageHot');
    });

    getWashRank.get({
      'longitude': user.longitude,
      'latitude': user.latitude
    }, function(data) {
      $scope.washShopsRank = data.data;
    }, function(data) {
      alert('NO DATA MainPageHot');
    });

  })

  $timeout(function() {
    //return false; // <--- comment this to "fix" the problem
    var sv = $ionicScrollDelegate.$getByHandle('horizontal').getScrollView();

    var container = sv.__container;

    var originaltouchStart = sv.touchStart;
    var originalmouseDown = sv.mouseDown;
    var originaltouchMove = sv.touchMove;
    var originalmouseMove = sv.mouseMove;

    container.removeEventListener('touchstart', sv.touchStart);
    container.removeEventListener('mousedown', sv.mouseDown);
    document.removeEventListener('touchmove', sv.touchMove);
    document.removeEventListener('mousemove', sv.mousemove);


    sv.touchStart = function(e) {
      e.preventDefault = function() {}
      originaltouchStart && originaltouchStart.apply(sv, [e]);
    }

    sv.touchMove = function(e) {
      e.preventDefault = function() {}
      originaltouchMove && originaltouchMove.apply(sv, [e]);
    }

    sv.mouseDown = function(e) {
      e.preventDefault = function() {}
      originalmouseDown && originalmouseDown.apply(sv, [e]);
    }

    sv.mouseMove = function(e) {
      e.preventDefault = function() {}
      originalmouseMove && originalmouseMove.apply(sv, [e]);
    }

    container.addEventListener("touchstart", sv.touchStart, false);
    container.addEventListener("mousedown", sv.mouseDown, false);
    document.addEventListener("touchmove", sv.touchMove, false);
    document.addEventListener("mousemove", sv.mouseMove, false);
  });

})


.controller('AccountCtrl', function($scope, $rootScope, UserInfo) {
  $scope.user = { img: 'img/avator.jpeg' };
  UserInfo.then(function(user) {
    $scope.user = user;
  })
  $scope.getAddress = function() {
    wx.ready(function() {
      wx.openAddress({
        success: function(res) {},
        cancel: function() {
          // alert("fa");
        }
      });
    });
  }
})

.controller('phoneNumberCheckCtrl', function($scope, $rootScope, $interval, UserInfo, SendCheckCode,
  CheckCheckCode, $ionicHistory, $state) {
  var e = {};
  $scope.check = {};
  $scope.check.time = 0;
  var timer = 0;

  UserInfo.then(function(user) {
    $scope.check.phoneNumber = localStorage.getItem('userPhone')
    $scope.$watch('check.phoneNumber', function(nv, ov) {
      if (nv) {
        localStorage.setItem('userPhone', nv);
      }
    })

    $scope.sendCode = function(e, order) {
      if ($scope.check.time > 0) {
        return;
      } else {
        $scope.check.time = 60;
      }
      SendCheckCode.get({
        'longitude': user.longitude,
        'latitude': user.latitude,
        'phone': $scope.check.phoneNumber
      }, function(data) {
        if (data.code == -1) {
          return;
        } else {
          alert('发送验证码成功');
        }
        timer = $interval(function() {
          $scope.check.time--;
          if ($scope.check.time < 0) {
            $interval.cancel(timer);
          }
        }, 1000);
      })
    }

    $scope.checkCode = function(e, order) {
      var phoneNumber = $scope.check.phoneNumber;
      if (!$scope.check.isAgree) {
        return;
      }
      CheckCheckCode.get({
        'longitude': user.longitude,
        'latitude': user.latitude,
        'phone': $scope.check.phoneNumber,
        'code': $scope.check.checkCode,
        'userId': user.userId
      }, function(data) {
        localStorage.removeItem('userPhone');
        // console.log(' checkcoode data.code', data.code);
        // console.log(' checkcoode data.msg', data.msg);
        if (data.code == -1) {
          alert('验证失败');
          return;
        }
        console.log('$scope.check.phoneNumber', phoneNumber);
        user.rdvPhone = $scope.check.phoneNumber;
        user.verify = '1';
        $state.go('app.sessions');
      });
    }
  })


})

.controller('SearchCtrl', function($scope, UserInfo, Search) {

  $scope.search = {};
  $scope.search.keyword = '';
  UserInfo.then(function(user) {
    $scope.searchGo = function(e, order) {
      Search.get({
        'latitude': user.latitude,
        'longitude': user.longitude,
        'keyword': $scope.search.keyword
      }, function(e) {
        if (e.data) {
          $scope.goodsOfWash = e.data.productsList['wash'];
          $scope.goodsOfFurit = e.data.productsList['fruit'];
          $scope.shopsOfWash = e.data.shopsList['wash'];
          $scope.shopsOfFurit = e.data.shopsList['fruit'];
        }
      })
    }
  })

})

;
