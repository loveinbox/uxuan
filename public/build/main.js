'use strict';

angular.module('starter', ['ionic', 'starter.controllers', 'starter.directives', 'starter.services']).config(["$stateProvider", "$urlRouterProvider", "$ionicConfigProvider", "$locationProvider", function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $ionicConfigProvider.tabs.position('bottom');
}]);

// .config(function($httpProvider) {
//   $httpProvider.interceptors.push('HttpResponseInterceptor');
// })

// .factory('HttpResponseInterceptor', HttpResponseInterceptor);

angular.module('starter.controllers', []);
angular.module('starter.services', ['ngResource']);
angular.module('starter.directives', []);

// angular.module('starter.controllers')

// .run(function run($rootScope) {
//   register();

//   function register() {
//     $.ajax({
//         url: 'http://www.lifeuxuan.com/index.php/wxctrl/register',
//         type: 'GET',
//         dataType: 'json',
//         data: {
//           'url': window.location.href
//         }
//       })
//       .done(function(e) {
//         wx.config({
//           debug: false,
//           appId: e.appId,
//           timestamp: e.timestamp,
//           nonceStr: e.nonceStr,
//           signature: e.signature,
//           jsApiList: ['checkJsApi', 'openAddress', 'getLocation']
//         });
//         wx.error(function(res) {
//           register2();
//         });
//       })
//       .fail(function(e) {
//         // register2();
//       })
//       .always(function() {});
//   };

//   function register2() {
//     $.ajax({
//         url: 'http://www.lifeuxuan.com/index.php/wxctrl/register',
//         type: 'GET',
//         dataType: 'json',
//         data: {
//           'url': 'http://www.lifeuxuan.com/app/cart'
//         }
//       })
//       .done(function(e) {
//         wx.config({
//           debug: false,
//           appId: e.appId,
//           timestamp: e.timestamp,
//           nonceStr: e.nonceStr,
//           signature: e.signature,
//           jsApiList: ['checkJsApi', 'openAddress', 'getLocation']
//         });
//         wx.error(function(res) {});
//       })
//       .fail(function(e) {
//         // alert(e);
//       })
//       .always(function() {});
//   };
// })

// function HttpResponseInterceptor($q, $log) {

//   function req(request) {
//     return request;
//   }

//   function res(response) {
//     function shequResponse(response) {
//       if (typeof response.data === 'string' || response.data.code == 0) {
//         return response;
//       } else {
//         //        alert('操作失败' + response.data && response.data.msg)
//         return $q.reject(response);
//       }
//     }
//     return shequResponse(response);
//   }

//   function responseError(response) {
//     switch (response.status) {
//       case 403:
//         alert('您没有权限访问这一资源');
//         break;
//       case 404:
//         alert('您要访问的资源似乎不存在');
//         break;
//         //      default:
//         //        alert('数据错误');
//     }
//     return response; //$q.reject(response);

//   }

//   return {
//     request: req,
//     response: responseError,
//     responseError: responseError,
//   };

// }
'use strict';

angular.module('starter').config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
  $stateProvider
  /*
   *  Base route
   */
  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: './build/pages/menu/menu.html'
  }).state('app.index', {
    url: '/index',
    views: {
      'tab-index': {
        templateUrl: './build/pages/menu/index.html',
        controller: 'IndexCtrl'
      }
    }
  }).state('app.cart', {
    url: '/cart',
    cache: false,
    views: {
      'tab-cart': {
        templateUrl: './build/pages/cart/cart.html',
        controller: 'CartCtrl'
      }
    }
  }).state('app.order-list', {
    url: '/order',
    cache: false,
    views: {
      'tab-order-list': {
        templateUrl: './build/pages/order/order-list.html',
        controller: 'OrderListCtrl'
      }
    }
  }).state('app.account', {
    url: '/account',
    cache: false,
    views: {
      'tab-account': {
        templateUrl: './build/pages/account/account.html',
        controller: 'AccountCtrl'
      }
    }
  })

  /*
   *  Shop route
   */
  .state('shop-list', {
    url: '/shop/:type',
    cache: false,
    templateUrl: './build/pages/shop/shop-list.html',
    controller: 'ShopListCtrl'
  }).state('shop-detail', {
    url: '/shop/:type/:shopId',
    cache: false,
    templateUrl: './build/pages/shop/shop-detail.html',
    controller: 'ShopDetailCtrl'
  })

  /*
   *  Goods route
   */
  .state('good-detail', {
    url: '/good/:type/:goodId',
    cache: false,
    templateUrl: './build/pages/good/good-detail.html',
    controller: 'GoodDetailCtrl'
  })

  // .state('orderStatus', {
  //   url: '/orderStatus',
  //   cache: false,
  //   templateUrl: 'templates/orderStatus.html',
  //   controller: 'OrderStatusCtrl'
  // })

  // .state('orderDetail', {
  //   url: '/orderDetail/:orderId/:orderType',
  //   cache: false,
  //   templateUrl: 'templates/orderDetail.html ',
  //   controller: 'orderDetailCtrl'
  // })

  // .state('phoneNumberCheck', {
  //   url: '/phoneNumberCheck',
  //   templateUrl: 'templates/phoneNumberCheck.html ',
  //   controller: 'phoneNumberCheckCtrl'
  // })

  // .state('washList', {
  //   url: '/washList',
  //   cache: false,
  //   templateUrl: 'templates/washTemplates/washList.html ',
  //   controller: 'washListCtrl'
  // })

  // .state('washSingle', {
  //   url: '/washSingle/:shopId',
  //   cache: false,
  //   templateUrl: 'templates/washTemplates/washSingle.html ',
  //   controller: 'washSingleCtrl'
  // })

  // .state('washCart', {
  //   url: '/washCart/:shopId',
  //   cache: false,
  //   templateUrl: 'templates/washTemplates/washCart.html '
  // })

  // .state('washSingleOrder', {
  //   url: '/washSingleOrder/:shopId/:orderId',
  //   cache: false,
  //   templateUrl: 'templates/washTemplates/washSingle-order.html ',
  //   controller: 'washSingleOrderCtrl'
  // })

  .state('search', {
    url: '/search',
    cache: false,
    templateUrl: './build/pages/search/search.html',
    controller: 'SearchCtrl'
  }).state('location', {
    url: '/location',
    template: "<div></div>",
    controller: function controller() {
      window.location.replace('/location.html');
    }
  }).state('pay', {
    url: '/pay',
    cache: false,
    templateUrl: './build/pages/order/wxPay.html ',
    controller: 'wxPayCtrl'
  });
  $urlRouterProvider.otherwise('/app/index');
}]);
'use strict';

angular.module('starter.services').factory('userWechatInfo', ["$resource", function ($resource) {
  return $resource('http://www.lifeuxuan.com/index.php/user/basicinfo');
}]).factory('userRegister', ["$resource", function ($resource) {
  return $resource('http://www.lifeuxuan.com/index.php/user/register');
}]).factory('Location', ["$q", function ($q) {

  var deferred = $q.defer();
  // var userLocation = {
  //   'latitude': 31.214197,
  //   'longitude': 121.496322,
  //   'isOut': false,
  //   'isGet': true,
  //   'text': '测试定位'
  // };

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
    geolocation.getCurrentPosition(function (r) {
      if (this.getStatus() == BMAP_STATUS_SUCCESS) {
        userLocation.latitude = r.point.lat;
        userLocation.longitude = r.point.lng;
        GetAddress(userLocation.latitude, userLocation.longitude);
      } else {
        alert('failed' + this.getStatus());
      }
    }, {
      enableHighAccuracy: true
    });
  }

  function GetAddress(lat, lng) {
    var point = new BMap.Point(lng, lat);
    var gc = new BMap.Geocoder();
    gc.getLocation(point, function (rs) {
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

  // for test
  // if (window.location.hostname == "localhost") {
  // deferred.resolve(userLocation);
  // return deferred.promise;
  // }
  return deferred.promise;
}]).factory('UserInfo', ["$resource", "$q", "$timeout", "userWechatInfo", "userRegister", "Location", function ($resource, $q, $timeout, userWechatInfo, userRegister, Location) {
  var deferred = $q.defer();
  var user = {
    userId: 'C0000000001'
  };
  Location.then(function (userLocation) {
    // user default value
    user.latitude = userLocation.latitude;
    user.longitude = userLocation.longitude;
    user.userLocation = userLocation;

    // ------------for test-----------------
    if (window.location.hostname == "localhost") {
      deferred.resolve(user);
      return deferred.promise;
    }
    // ------------for test-----------------

    userWechatInfo.get({}, function (e) {
      user.name = e.data.nickname;
      user.img = e.data.headimgurl;
      user.openid = e.data.openid;
      user.headPicUrl = e.data.headimgurl;
      if (user.name == '哈库那玛塔塔') {
        // screenLog.init({ autoScroll: true });
      }
      userRegister.get({
        'latitude': user.latitude,
        'longitude': user.longitude,
        'openId': user.openid,
        'username': user.nickname,
        'password': '',
        'headPicUrl': user.headPicUrl
      }, function (e) {
        if (e.data) {
          user.userId = e.data.userId;
          user.verify = e.data.verifyCode;
          var address = e.data.lastAddress;
          user.rcvAddress = address.rcvAddress;
          user.rcvPhone = address.rcvPhone;
          user.rcvName = address.rcvName;

          console.log('rcvPhone', user.rcvPhone);
          deferred.resolve(user);
        }
      });
    });
  });

  return deferred.promise;
}]).controller('AccountCtrl', ["$scope", "$rootScope", "UserInfo", function ($scope, $rootScope, UserInfo) {
  $scope.user = { img: 'img/avator.jpeg' };
  UserInfo.then(function (user) {
    $scope.user = user;
  });
  $scope.getAddress = function () {
    wx.ready(function () {
      wx.openAddress({
        success: function success(res) {},
        cancel: function cancel() {}
      });
    });
  };
}]);
'use strict';

angular.module('starter.controllers').controller('CartCtrl', ["$scope", "$rootScope", "$state", "$q", "$stateParams", "UserInfo", "NearByEguard", "ShoppingCart", "WxPay", "FruitOrder", "WashOrder", "WashReserve", function ($scope, $rootScope, $state, $q, $stateParams, UserInfo, NearByEguard, ShoppingCart, WxPay, FruitOrder, WashOrder, WashReserve) {
  var type = $stateParams.type;
  $scope.type = type;
  var isReserve = false;

  UserInfo.then(function (user) {
    // if (type == 'wash') {
    //   $scope.washOrder = FruitOrWash.getParams().washOrder;
    //   let isReserve = FruitOrWash.getParams().isReserve;
    // } else {
    //   isReserve = false;
    // }

    $scope.order = {
      user: user,
      sendTime: [],
      guard: 0,
      carts: ShoppingCart.getCart(type)
    };
    if (type == 'wash' && isReserve) {
      $scope.order.carts = [];
    }

    $scope.order.totalMoney = ShoppingCart.getTotalCartMoney(type);

    $scope.payButton = {
      text: '微信支付'
    };

    function judgeOrder() {
      $scope.payButton.text = '微信支付';
      if (type == 'furit' && $scope.status.isGetThroesold == false) {
        // alert('未达起送价');
        $scope.payButton.text = '未达起送价';
        return false;
      }
      if ($scope.status.isAdded == false) {
        // alert('请添加收货地址');
        $scope.payButton.text = '请添加收货地址';
        return false;
      }
      if ((type == 'furit' || !isReserve) && !$scope.order.carts.length) {
        // alert('请添加商品');
        $scope.payButton.text = '请添加商品';
        return false;
      }
      if (!$scope.status.isAddressValidated) {
        $scope.payButton.text = '请修改送货地址';
        return false;
      }
      if (isReserve) {
        $scope.payButton.text = '预约洗衣';
      } else {
        $scope.payButton.text = '微信支付';
      }
      return true;
    }
    $scope.confirmOrder = function (event) {
      if (!(user.verify - 0)) {
        $state.go('phoneNumberCheck');
        return;
      }
      event.stopPropagation();
      event.preventDefault();
      if (!judgeOrder()) {
        return;
      };

      var insertMethod = null;
      var orderData = {
        'latitude': user.longitude,
        'longitude': user.latitude,
        'userId': user.userId,
        'eguardId': $scope.order.guard,
        'rcvName': $scope.order.user.rcvName || 'test',
        'rcvPhone': $scope.order.user.rcvPhone || '123',
        'rcvAddress': $scope.order.user.rcvAddress || 'test',
        'preferRcvTime': [moment($scope.order.sendTime[0]).unix(), moment($scope.order.sendTime[1]).unix()], //期望收货时间
        'preferFetchTime': [moment($scope.order.sendTime[0]).unix(), moment($scope.order.sendTime[1]).unix()],
        'needTicket': false,
        'tip': '',
        'detail': ShoppingCart.getCart(type)
      };
      if (FruitOrWash.getParams().washOrder) {
        orderData.shopId = FruitOrWash.getParams().washOrder.shopId;
        orderData.orderIdsList = [FruitOrWash.getParams().washOrder.orderId];
      };
      if (type == 'furit') {
        insertMethod = FruitOrderInsert;
      } else {
        if (isReserve) {
          insertMethod = insertWashReserve;
        } else {
          insertMethod = insertWashOrder;
          orderData.detail = ShoppingCart.getCart(type)[0].productsList;
        }
      }
      insertMethod.save(orderData).$promise.then(function (res) {
        if (isReserve) {
          alert('预约成功');
          ShoppingCart.cleanCart(type);
          $state.go('app.orders');
        } else {
          var data = res.data;
          var sendData = FruitOrWash.get() == 'furit' ? {
            'orderIdsList': data.orderIdsList,
            'orderType': 17001
          } : {
            'orderIdsList': data.orderIdsList,
            'orderType': 17002
          };
          sendData.money = data.money;
          WxPayParam.set(sendData);
          ShoppingCart.cleanCart(type);
          $state.go('pay');
        }
      }).catch(function (res) {
        alert('下订单失败');
        orderStatus.failed();
        $state.go('app.orders');
      });
    };
  });
}]);
'use strict';

angular.module('starter.controllers').controller('CartCtrl999', ["$scope", "$rootScope", "$state", "$q", "$stateParams", "UserInfo", "NearByEguard", "ShoppingCart", "WxPay", "FruitOrder", "WashOrder", "WashReserve", function ($scope, $rootScope, $state, $q, $stateParams, UserInfo, NearByEguard, ShoppingCart, WxPay, FruitOrder, WashOrder, WashReserve) {
  var type = $stateParams.type;
  $scope.type = type;
  var isReserve = false;

  UserInfo.then(function (user) {
    // if (type == 'wash') {
    //   $scope.washOrder = FruitOrWash.getParams().washOrder;
    //   let isReserve = FruitOrWash.getParams().isReserve;
    // } else {
    //   isReserve = false;
    // }

    $scope.order = {
      user: user,
      sendTime: [],
      guard: 0,
      carts: ShoppingCart.getCart(type),
      isReserve: isReserve
    };
    if (type == 'wash' && isReserve) {
      $scope.order.carts = [];
    }

    $scope.order.isAllChecked = true;
    $scope.status = {
      isAdded: false,
      isGetThroesold: ShoppingCart.isGetThroesold(type),
      isAddressValidated: false
    };
    $scope.order.totalMoney = ShoppingCart.getTotalCartMoney(type);

    if (user.rcvPhone) {
      $scope.status.isAdded = true;
      $scope.order.user.rcvName = user.rcvName;
      $scope.order.user.rcvPhone = user.rcvPhone;
      $scope.order.user.rcvAddress = user.rcvAddress;
    }

    isTooFar($scope.order.user.rcvAddress).then(function () {
      $scope.status.isAddressValidated = false;
    }, function () {
      $scope.status.isAddressValidated = true;
    });

    NearByEguard.get({
      'longitude': user.longitude,
      'latitude': user.latitude
    }, function (data) {
      $scope.order.eGuards = data.data;
      $scope.order.guard = data.data[0].eguardId;
    }, function (data) {
      alert('NO DATA');
    });

    $scope.$on('cartChange', function (event, data) {
      $scope.status.isGetThroesold = ShoppingCart.isGetThroesold(type);
      $scope.order.carts = ShoppingCart.getCart(type);
      $scope.order.totalMoney = ShoppingCart.getTotalCartMoney(type);
      judgeOrder();
    });

    $scope.pickShop = function (event, shop) {
      event.stopPropagation();
      ShoppingCart.checkShop(shop, type);
      $rootScope.$broadcast('cartChange');
    };

    $scope.pickShopGood = function (event, good, shop) {
      event.stopPropagation();
      ShoppingCart.checkShopGood(type, good, shop);
      $rootScope.$broadcast('cartChange');
    };

    $scope.pickAll = function () {
      ShoppingCart.checkAll($scope.order.isAllChecked, type);
      $rootScope.$broadcast('cartChange');
    };
    $scope.payButton = {
      text: '微信支付'
    };

    function judgeOrder() {
      $scope.payButton.text = '微信支付';
      if (type == 'furit' && $scope.status.isGetThroesold == false) {
        // alert('未达起送价');
        $scope.payButton.text = '未达起送价';
        return false;
      }
      if ($scope.status.isAdded == false) {
        // alert('请添加收货地址');
        $scope.payButton.text = '请添加收货地址';
        return false;
      }
      if ((type == 'furit' || !isReserve) && !$scope.order.carts.length) {
        // alert('请添加商品');
        $scope.payButton.text = '请添加商品';
        return false;
      }
      if (!$scope.status.isAddressValidated) {
        $scope.payButton.text = '请修改送货地址';
        return false;
      }
      if (isReserve) {
        $scope.payButton.text = '预约洗衣';
      } else {
        $scope.payButton.text = '微信支付';
      }
      return true;
    }
    $scope.confirmOrder = function (event) {
      if (!(user.verify - 0)) {
        $state.go('phoneNumberCheck');
        return;
      }
      event.stopPropagation();
      event.preventDefault();
      if (!judgeOrder()) {
        return;
      };

      var insertMethod = null;
      var orderData = {
        'latitude': user.longitude,
        'longitude': user.latitude,
        'userId': user.userId,
        'eguardId': $scope.order.guard,
        'rcvName': $scope.order.user.rcvName || 'test',
        'rcvPhone': $scope.order.user.rcvPhone || '123',
        'rcvAddress': $scope.order.user.rcvAddress || 'test',
        'preferRcvTime': [moment($scope.order.sendTime[0]).unix(), moment($scope.order.sendTime[1]).unix()], //期望收货时间
        'preferFetchTime': [moment($scope.order.sendTime[0]).unix(), moment($scope.order.sendTime[1]).unix()],
        'needTicket': false,
        'tip': '',
        'detail': ShoppingCart.getCart(type)
      };
      if (FruitOrWash.getParams().washOrder) {
        orderData.shopId = FruitOrWash.getParams().washOrder.shopId;
        orderData.orderIdsList = [FruitOrWash.getParams().washOrder.orderId];
      };
      if (type == 'furit') {
        insertMethod = FruitOrderInsert;
      } else {
        if (isReserve) {
          insertMethod = insertWashReserve;
        } else {
          insertMethod = insertWashOrder;
          orderData.detail = ShoppingCart.getCart(type)[0].productsList;
        }
      }
      insertMethod.save(orderData).$promise.then(function (res) {
        if (isReserve) {
          alert('预约成功');
          ShoppingCart.cleanCart(type);
          $state.go('app.orders');
        } else {
          var data = res.data;
          var sendData = FruitOrWash.get() == 'furit' ? {
            'orderIdsList': data.orderIdsList,
            'orderType': 17001
          } : {
            'orderIdsList': data.orderIdsList,
            'orderType': 17002
          };
          sendData.money = data.money;
          WxPayParam.set(sendData);
          ShoppingCart.cleanCart(type);
          $state.go('pay');
        }
      }).catch(function (res) {
        alert('下订单失败');
        orderStatus.failed();
        $state.go('app.orders');
      }).finally(function () {});
    };

    $scope.getAddress = function (event) {
      wx.ready(function () {
        wx.openAddress({
          success: function success(res) {
            var addressGot = res.provinceName + res.cityName + res.countryName + res.detailInfo;
            $scope.$apply(function () {
              $scope.order.user.rcvAddress = addressGot;
              $scope.order.user.rcvName = res.userName;
              $scope.order.user.rcvPhone = res.telNumber + '';
              $scope.status.isAdded = true;
              isTooFar(addressGot).then(function () {
                $scope.status.isAddressValidated = false;
              }, function () {
                $scope.status.isAddressValidated = true;
              });
            });
          }
        });
      });
    };

    $scope.showAlert = function () {
      var alertPopup = $ionicPopup.alert({
        title: 'U选到家',
        template: '收货地址超出您选择店面服务范围'
      });
    };

    function isTooFar(address) {
      var deferred = $q.defer();
      var gc = new BMap.Geocoder();
      address = address || '';
      gc.getPoint(address, function (point) {
        var map = new BMap.Map("allmap");
        var pointA = new BMap.Point(user.longitude, user.latitude); // 创建点坐标A
        var pointB = new BMap.Point(point.lng, point.lat); // 创建点坐标B
        var distacne = map.getDistance(pointA, pointB).toFixed(2);
        if (distacne > 6000) {
          $scope.showAlert();
          deferred.resolve(true);
        } else {
          deferred.reject(false);
        }
      });
      return deferred.promise;
    }
  });
}]);
'use strict';

angular.module('starter.controllers').controller('GoodDetailCtrl', ["$rootScope", "$scope", "$stateParams", "UserInfo", "FruitDetail", "FruitPicShow", "ShoppingCart", function ($rootScope, $scope, $stateParams, UserInfo, FruitDetail, FruitPicShow, ShoppingCart) {
  var goodId = $stateParams.goodId;
  var type = $stateParams.type;
  $scope.isHideAddCart = false;
  $scope.singleNumber = 0;

  UserInfo.then(function (user) {
    FruitDetail.get({
      'longitude': user.longitude,
      'latitude': user.latitude,
      'productId': goodId
    }, function (data) {
      $scope.good = data.data.product;
      $scope.shop = data.data.shop;
      $rootScope.$broadcast('cartChange');
      FruitPicShow.get({
        'longitude': user.longitude,
        'latitude': user.latitude,
        'productId': goodId
      }, function (data) {
        $scope.imgs = data.data;
      });
    });

    $scope.$on('cartChange', function (event, data) {
      $scope.singleNumber = ShoppingCart.getGoodNumber($scope.good, $scope.shop);
      if ($scope.singleNumber > 0) {
        $scope.isHideAddCart = true;
      } else {
        $scope.isHideAddCart = false;
      }
    });
  });
}]);
'use strict';

angular.module('starter.controllers').controller('IndexCtrl', ["$scope", "$rootScope", "$timeout", "$ionicScrollDelegate", "$ionicSlideBoxDelegate", "UserInfo", "BannerIndex", "MainPageHot", "NearByFruitShops", "NearByWashShops", "FruitRank", "WashRank", function ($scope, $rootScope, $timeout, $ionicScrollDelegate, $ionicSlideBoxDelegate, UserInfo, BannerIndex, MainPageHot, NearByFruitShops, NearByWashShops, FruitRank, WashRank) {
  $scope.location = {
    isGet: false,
    isOut: false,
    text: '定位中...'
  };
  UserInfo.then(function (user) {
    $scope.location = user.userLocation;
    if (user.userLocation.street) {
      $scope.location.text = user.userLocation.street;
    }
    $scope.$watch('user.userLocation', function () {
      if (user.userLocation.street) {
        $scope.location.text = user.userLocation.street;
      }
    }, true);

    var baseData = {
      'longitude': user.longitude,
      'latitude': user.latitude
    };

    MainPageHot.get(baseData, function (data) {
      $scope.hotList = data.data;
    });

    BannerIndex.get(baseData, function (data) {
      $scope.banners = data.data;
      $ionicSlideBoxDelegate.update();
      $ionicSlideBoxDelegate.loop(true);
    });

    NearByFruitShops.get(baseData, function (data) {
      $scope.fruitShop = data.data;
    });

    NearByWashShops.get(baseData, function (data) {
      $scope.washShop = data.data;
    });

    FruitRank.get(baseData, function (data) {
      $scope.fruitRank = data.data;
    });

    WashRank.get(baseData, function (data) {
      $scope.washRank = data.data;
    });
  });
}]);
"use strict";
'use strict';

angular.module('starter.controllers').controller('OrderListCtrl', ["$scope", "$state", "OrderList", "UserInfo", "StartPrice", "cancelFruit", "cancelWash", function ($scope, $state, OrderList, UserInfo, StartPrice, cancelFruit, cancelWash) {

  UserInfo.then(function (user) {
    getOrders();

    $scope.doRefresh = function () {
      getOrders();
      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.clickPrice = function (event, order) {
      event.stopPropagation();
      event.preventDefault();
      StartPrice.save({
        orderId: order.orderId
      }).$promise.then(function (res) {
        if (res.code === 0) {
          FruitOrWash.toWash(order, false);
          $state.go('washSingleOrder', { shopId: order.shopId, orderId: order.orderId });
        }
      });
    };

    $scope.clickRed = function (event, order) {
      event.stopPropagation();
      event.preventDefault();
      var cancelMethod = order.orderType == 17001 ? cancelFruit : cancelWash;
      cancelMethod.save({
        orderId: order.orderId
      }).$promise.then(function (res) {
        if (res.code === 0) {
          alert('取消成功');
          getOrders();
        }
      });
    };

    function getOrders() {
      OrderList.get({
        'customerId': user.userId,
        'pos': 0
      }, function (data) {
        $scope.orders = data.data;
      });
    }
  });
}]).controller('orderDetailCtrl', ["$scope", "$rootScope", "$stateParams", "FruitOrderDetail", "WashOrderDetail", "UserInfo", "StartPrice", "FruitOrWash", "$state", function ($scope, $rootScope, $stateParams, FruitOrderDetail, WashOrderDetail, UserInfo, StartPrice, FruitOrWash, $state) {
  $scope.type = $stateParams.orderType;
  UserInfo.then(function (user) {
    getOrder();

    function getOrder(argument) {
      var detailMethod = $scope.type == 17001 ? FruitOrderDetail : WashOrderDetail;
      detailMethod.get({
        'longitude': user.longitude,
        'latitude': user.latitude,
        'orderId': $stateParams.orderId
      }, function (data) {
        $scope.order = data.data;
        var orderStage = data.data.orderStatusId;
        if (orderStage - 0 <= 11003) {
          setStage([1]);
          return;
        }
        if (orderStage - 0 < 11008) {
          setStage([0, 1]);
          return;
        }
        if (orderStage - 0 < 11012) {
          setStage([0, 0, 1]);
          return;
        }
        if (orderStage - 0 <= 11015) {
          setStage([0, 0, 0, 1]);
          return;
        }
      });
    }

    $scope.clickPrice = function (event, order) {
      event.stopPropagation();
      event.preventDefault();
      StartPrice.save({
        orderId: order.orderId
      }).$promise.then(function (res) {
        if (res.code === 0) {
          FruitOrWash.toWash(order, true);
          $state.go('washSingleOrder', { shopId: order.shopId, orderId: order.orderId });
        }
      });
    };
  });

  function setStage(array) {
    $scope.stage01 = array[0] === 1;
    $scope.stage02 = array[1] === 1;
    $scope.stage03 = array[2] === 1;
    $scope.stage04 = array[3] === 1;
  }
}]);
'use strict';

angular.module('starter.services').service('ShoppingCart', ["$rootScope", function ($rootScope) {
  var stroage = {
    'furit': 'UxuanShoppingCart',
    'wash': 'washShoppingCart'
  };
  // 所有商家的购物车，即整个购物车的集合
  var furitCart = {
    number: 0,
    money: 0,
    isGetThroesold: false,
    cart: JSON.parse(localStorage.getItem('UxuanShoppingCart')) || []
  };
  var washCart = {
    number: 0,
    money: 0,
    isGetThroesold: false,
    cart: JSON.parse(localStorage.getItem('washShoppingCart')) || []
  };
  var totalCart = {
    furit: furitCart,
    wash: washCart
  };

  // 一个商家的购物车
  function toShopCart(shop) {
    var shopCart = {
      'shopId': shop.shopId,
      'shopInfo': {
        shopName: shop.shopName,
        shopPicUrl: shop.shopHeadImg,
        sendPrice: shop.shopDeliveryFee,
        sendStartPrice: shop.shopStartMoney || shop.shopFreeDeliveryMoney
      },
      'singleCartTotalNumber': 0,
      'isChecked': true,
      'number': 0, //购物车内所有商品的数量
      'productsList': [] //goods in this shopCart
    };
    return shopCart;
  }

  function toCartGood(good) {
    var cartGood = {
      'productId': good.productId,
      'productName': good.productName,
      'productDescription': good.productDescription,
      'productHeadImg': good.productHeadImg,
      'productClassifyId': good.productClassifyId,
      'productUnit': good.productUnit,
      'productMeasure': good.productMeasure,
      'productPrice': good.productPrice,
      'productMonthSaleVolume': good.productMonthSaleVolume,
      'productQuantity': 0, //该商品的数量
      'isChecked': true
    };
    return cartGood;
  }

  this.getCart = function (type) {
    var type = type || 'furit';
    var _cart = totalCart[type].cart;
    return _cart;
  };
  this.add = function (event, good, shop, type) {
    var type = type || 'furit';
    var _cart = totalCart[type].cart;
    cartFly(event);
    var shopIndex = _.findIndex(_cart, { 'shopId': shop.shopId });
    var cartGood = toCartGood(good);
    var shopCart = toShopCart(shop);
    // 商店购物车第一次被添加
    if (shopIndex < 0) {
      cartGood.productQuantity = 1;
      shopCart.number = 1;
      shopCart.productsList = [cartGood];
      _cart.push(shopCart);
    } else {
      var goodIndex = _.findIndex(_cart[shopIndex].productsList, { 'productId': good.productId });
      // 商品第一次被添加
      if (goodIndex < 0) {
        cartGood.productQuantity = 1;
        _cart[shopIndex].number++;
        _cart[shopIndex].productsList.push(cartGood);
      } else {
        // 商品第二次被添加
        _cart[shopIndex].productsList[goodIndex].productQuantity++;
        _cart[shopIndex].number++;
      }
    }
    totalCart[type].number++;
    $rootScope.$broadcast('cartChange');
    calculateMoney(type);
  };

  this.remove = function (good, shop, type) {
    var type = type || 'furit';
    var _cart = totalCart[type].cart;
    var shopIndex = _.findIndex(_cart, { 'shopId': shop.shopId });
    if (shopIndex < 0) {
      return;
    }
    var goodIndex = _.findIndex(_cart[shopIndex].productsList, { 'productId': good.productId });
    if (goodIndex < 0) {
      return;
    }
    var cartGood = toCartGood(good);
    var shopCart = toShopCart(shop);
    var tempNumber = --_cart[shopIndex].productsList[goodIndex].productQuantity;
    _cart[shopIndex].number--;
    totalCart[type].number--;
    if (tempNumber == 0) {
      _cart[shopIndex].productsList.splice(goodIndex, 1);
      if (_cart[shopIndex].productsList.length == 0) {
        _cart.splice(shopIndex, 1);
      }
    }
    $rootScope.$broadcast('cartChange');
    calculateMoney(type);
  };

  this.getTotalCartNumber = function (type) {
    var type = type || 'furit';
    return totalCart[type].number;
  };

  this.getTotalCartMoney = function (type) {
    var type = type || 'furit';
    var _cart = totalCart[type].cart;
    calculateMoney(type);
    return _cart.money;
  };

  this.getGoodNumber = function (good, shop, type) {
    var type = type || 'furit';
    var _cart = totalCart[type].cart;
    var shopIndex = _.findIndex(_cart, { 'shopId': shop.shopId });
    if (shopIndex < 0) {
      return 0;
    } else {
      var goodIndex = _.findIndex(_cart[shopIndex].productsList, { 'productId': good.productId });
      return goodIndex < 0 ? 0 : _cart[shopIndex].productsList[goodIndex].productQuantity;
    }
  };

  this.getshopCartNumber = function (shopId, type) {
    var type = type || 'furit';
    var _cart = totalCart[type].cart;
    var shopIndex = _.findIndex(_cart, { 'shopId': shopId });
    if (shopIndex < 0) {
      return 0;
    } else {
      return _cart[shopIndex].number;
    }
  };

  this.getshopCartMoney = function (shopId, type) {
    var type = type || 'furit';
    var _cart = totalCart[type].cart;
    var shop = _.find(_cart, { 'shopId': shopId });
    var tempTotalMoney = 0;
    if (!shop) {
      return 0;
    } else {
      $.each(shop.productsList, function (index, value) {
        tempTotalMoney += value.productPrice * value.productQuantity;
      });
      return tempTotalMoney;
    }
  };

  this.getshopProductList = function (shopId, type) {
    var type = type || 'furit';
    var _cart = totalCart[type].cart;
    var shopIndex = _.findIndex(_cart, { 'shopId': shopId });
    return _cart[shopIndex].productsList;
  };

  this.isGetThroesold = function (type) {
    var type = type || 'furit';
    var _cart = totalCart[type].cart;
    _cart.isGetThroesold = true;
    if (_cart.length > 0) {
      $.each(_cart, function (index, shopCart) {
        // 如果选择了，却为达到起送价
        if (shopCart.isChecked == true && shopCart.isReachStartPrice == false) {
          _cart.isGetThroesold = false;
        }
      });
    }
    return _cart.isGetThroesold;
  };

  this.isShowReachStartPrice = function (shopId, type) {
    var type = type || 'furit';
    var _cart = totalCart[type].cart;
    var shopIndex = _.findIndex(_cart, { 'shopId': shopId });
    return _cart[shopIndex].isReachStartPrice;
  };

  this.checkShop = function (shop, type) {
    var type = type || 'furit';
    var _cart = totalCart[type].cart;
    var shopIndex = _.findIndex(_cart, { 'shopId': shop.shopId });
    $.each(_cart[shopIndex].productsList, function (index, value) {
      value.isChecked = _cart[shopIndex].isChecked;
    });
    calculateMoney(type);
  };

  this.checkAll = function (isAllChecked, type) {
    var type = type || 'furit';
    var _cart = totalCart[type].cart;
    $.each(_cart, function (index, el) {
      el.isChecked = isAllChecked;
      $.each(el.productsList, function (index, value) {
        value.isChecked = isAllChecked;
      });
    });
    calculateMoney(type);
  };

  this.checkShopGood = function (type, good, shop) {
    var type = type || 'furit';
    var _cart = totalCart[type].cart;
    var shopIndex = _.findIndex(_cart, { 'shopId': shop.shopId });
    var isAllChecked = true;
    $.each(_cart[shopIndex].productsList, function (index, value) {
      if (!value.isChecked) {
        isAllChecked = false;
      }
    });
    _cart[shopIndex].isChecked = isAllChecked;
    calculateMoney(type);
  };

  this.cleanCart = function (type) {
    var type = type || 'furit';
    var _cart = totalCart[type].cart;
    for (var i = _cart.length - 1; i >= 0; i--) {
      if (_cart[i]) {
        if (_cart[i].isChecked) {
          _cart.splice(i, 1);
        } else {
          for (var j = _cart[i].productsList.length - 1; j >= 0; j--) {
            if (_cart[i].productsList[j] && _cart[i].productsList[j].isChecked) {
              _cart[i].productsList.splice(j, 1);
            }
          }
        }
      }
    }
    localStorage.setItem(stroage[type], JSON.stringify(_cart));
  };

  function calculateMoney(type) {
    var type = type || 'furit';
    var _cart = totalCart[type].cart;
    _cart.money = 0;
    $.each(_cart, function (index, shopCart) {
      var tempTotalMoney = 0;
      $.each(shopCart.productsList, function (index, value) {
        if (value.isChecked) {
          tempTotalMoney += value.productPrice * value.productQuantity;
        }
      });
      shopCart.singleCartTotalNumber = tempTotalMoney;
      // 是否达到起送价
      if (shopCart.singleCartTotalNumber < shopCart.shopInfo.sendStartPrice * 100) {
        shopCart.isReachStartPrice = false;
      } else {
        shopCart.isReachStartPrice = true;
      }
      // 是否计算运费
      if (tempTotalMoney > 0) {
        if (!(type == 'wash' && shopCart.isReachStartPrice)) shopCart.singleCartTotalNumber += shopCart.shopInfo.sendPrice * 100;
      }
      _cart.money += shopCart.singleCartTotalNumber;
    });
    localStorage.setItem(stroage[type], JSON.stringify(_cart));
  }

  function cartFly(event) {
    if ($(".icon-cart:visible").length < 1) {
      return;
    }
    var offset = $("#icon-cart-footer:visible").offset();
    var flyer = $('<i class="u-flyer icon ion-ios-color-filter"><i/>');
    flyer.fly({
      start: {
        left: event.pageX,
        top: event.pageY
      },
      end: {
        left: offset.left + 50,
        top: offset.top + 20,
        width: 0,
        height: 0
      },
      onEnd: function onEnd() {
        this.destory();
      }
    });
  }
}]).service('orderStatus', function () {
  var status = '';
  this.ordered = function () {
    stauts = 'ordered';
  };
  this.paied = function () {
    stauts = 'paied';
  };
  this.failed = function () {
    stauts = 'failed';
  };
  this.get = function () {
    return stauts;
  };
});
'use strict';

angular.module('starter.controllers').controller('OrderStatusCtrl', ["$scope", "$stateParams", function ($scope, $stateParams) {
  var status = $stateParams.status;
  switch (status) {
    case 'ordered':
      $scope.status = "下单成功，未支付";
      break;
    case 'paied':
      $scope.status = "支付成功";
      break;
    default:
      $scope.status = "下单失败";
      break;
  }
}]);
'use strict';

angular.module('starter.controllers').controller('wxPayCtrl', ["$scope", "$state", "$stateParams", "WxPayParam", "UserInfo", "orderStatus", "WxPay", "WxPayConfirmWash", "WxPayConfirmFruit", function ($scope, $state, $stateParams, WxPayParam, UserInfo, orderStatus, WxPay, WxPayConfirmWash, WxPayConfirmFruit) {
  UserInfo.then(function (user) {
    $scope.$on("$ionicParentView.leave", function (event, data) {
      // console.log('loaded');
      localStorage.setItem('backForbidden', true);
    });
    var sendData = WxPayParam.get();
    $scope.pay = {
      money: sendData.money
    };
    $scope.payOrder = function () {
      WxPay.save(sendData).$promise.then(function (res) {
        wx.ready(function () {
          wx.chooseWXPay({
            timestamp: res.timeStamp,
            nonceStr: res.nonceStr,
            package: res.package,
            signType: res.signType,
            paySign: res.paySign,
            success: function success(res) {
              alert('支付成功');
              orderStatus.paied();
              if (sendData.orderType == 17001) {
                WxPayConfirmFruit.save({ 'orderIdsList': sendData.orderIdsList });
              } else {
                WxPayConfirmWash.save({ 'orderIdsList': sendData.orderIdsList });
              }
              WxPayParam.set({});
              $state.go('app.orders');
            },
            cancel: function cancel(res) {
              orderStatus.ordered();
              $state.go('app.orders');
            },
            complete: function complete(res) {}
          });
        });
      }, function () {
        alert('下订单成功，等待支付');
        orderStatus.ordered();
        $state.go('app.orders');
      });
    };
  });
}]);
'use strict';

angular.module('starter.controllers').controller('phoneNumberCheckCtrl', ["$scope", "$rootScope", "$interval", "UserInfo", "SendCheckCode", "CheckCheckCode", "$ionicHistory", "$state", function ($scope, $rootScope, $interval, UserInfo, SendCheckCode, CheckCheckCode, $ionicHistory, $state) {
  var e = {};
  $scope.check = {};
  $scope.check.time = 0;
  var timer = 0;

  UserInfo.then(function (user) {
    $scope.check.phoneNumber = localStorage.getItem('userPhone');
    $scope.$watch('check.phoneNumber', function (nv, ov) {
      if (nv) {
        localStorage.setItem('userPhone', nv);
      }
    });

    $scope.sendCode = function (e, order) {
      if ($scope.check.time > 0) {
        return;
      } else {
        $scope.check.time = 60;
      }
      SendCheckCode.get({
        'longitude': user.longitude,
        'latitude': user.latitude,
        'phone': $scope.check.phoneNumber
      }, function (data) {
        if (data.code == -1) {
          return;
        } else {
          alert('发送验证码成功');
        }
        timer = $interval(function () {
          $scope.check.time--;
          if ($scope.check.time < 0) {
            $interval.cancel(timer);
          }
        }, 1000);
      });
    };

    $scope.checkCode = function (e, order) {
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
      }, function (data) {
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
    };
  });
}]);
'use strict';

angular.module('starter.controllers').controller('SearchCtrl', ["$scope", "UserInfo", "Search", function ($scope, UserInfo, Search) {

  $scope.search = {};
  $scope.search.keyword = '';
  UserInfo.then(function (user) {
    $scope.searchGo = function (e, order) {
      Search.get({
        'latitude': user.latitude,
        'longitude': user.longitude,
        'keyword': $scope.search.keyword
      }, function (e) {
        if (e.data) {
          $scope.goodsOfWash = e.data.productsList['wash'];
          $scope.goodsOfFruit = e.data.productsList['fruit'];
          $scope.shopsOfWash = e.data.shopsList['wash'];
          $scope.shopsOfFruit = e.data.shopsList['fruit'];
        }
      });
    };
  });
}]);
'use strict';

angular.module('starter.controllers').controller('ShopDetailCtrl', ["$scope", "$stateParams", "FruitByShop", "WashByShop", "UserInfo", function ($scope, $stateParams, FruitByShop, WashByShop, UserInfo) {
  UserInfo.then(function (user) {
    var type = $stateParams.type;
    var method = type === 'fruit' ? FruitByShop : WashByShop;
    $scope.type = type;
    method.get({
      'shopId': $stateParams.shopId
    }, function (res) {
      $scope.shop = res.data.shop;
      $scope.goodList = res.data.productsList;
      $scope.classList = res.data.classifysList;
    });
  });
}]);
'use strict';

angular.module('starter.controllers').controller('ShopListCtrl', ["$scope", "$stateParams", "$ionicSlideBoxDelegate", "UserInfo", "NearByFruitShops", "BannerFruit", "FruitHot", "NearByWashShops", "BannerWash", "WashHot", function ($scope, $stateParams, $ionicSlideBoxDelegate, UserInfo, NearByFruitShops, BannerFruit, FruitHot, NearByWashShops, BannerWash, WashHot) {
  var type = $stateParams.type;
  var shopMethodMap = {
    fruit: NearByFruitShops,
    wash: NearByWashShops
  };
  var bannerMethodMap = {
    fruit: BannerFruit,
    wash: BannerWash
  };
  var hotMethodMap = {
    fruit: FruitHot,
    wash: WashHot
  };
  $scope.type = type;
  UserInfo.then(function (user) {
    var baseData = {
      'longitude': user.longitude,
      'latitude': user.latitude
    };

    hotMethodMap[type].get(baseData, function (data) {
      $scope.hotList = data.data;
    });

    shopMethodMap[type].get(baseData, function (data) {
      $scope.shops = data.data;
    });

    bannerMethodMap[type].get(baseData, function (data) {
      $scope.banners = data.data;
      $ionicSlideBoxDelegate.update();
      $ionicSlideBoxDelegate.loop(true);
    });
  });
}]);
'use strict';

var baseUrl = 'http://www.lifeuxuan.com/index.php';
var serviceURLs = {
  /*
   * Common
   */
  BannerIndex: '/banner/index',
  NearByEguard: '/eguards',
  MainPageHot: '/hot/index',
  FruitRank: '/rank/index/fruit',
  WashRank: '/rank/index/wash',
  SendCheckCode: '/code/send',
  CheckCheckCode: '/code/check',
  Search: '/search/normal',
  /*
   * Order show
   */
  OrderList: '/orderlist/customer',
  FruitOrderDetail: '/orderdetail/customer/fruit',
  WashOrderDetail: '/orderdetail/customer/wash',
  /*
   * Order Action
   */
  FruitOrder: '/order/insert/fruit',
  WashOrder: '/order/insert/wash',
  WashReserve: '/order/reserve/wash',
  WxPay: '/wxctrl/pay',
  WxPayConfirmFruit: '/payconfirm/fruit',
  WxPayConfirmWash: '/payconfirm/wash',
  StartPrice: '/communicate/customer/wash/startprice',
  cancelFruit: '/communicate/customer/fruit/cancel',
  cancelWash: '/communicate/customer/wash/cancel',
  /*
   * Fruit
   */
  BannerFruit: '/banner/shoplist/fruit',
  NearByFruitShops: '/shoplist/fruit',
  FruitByShop: '/shop/fruit',
  FruitHot: '/hot/shoplist/fruit',
  FruitDetail: '/product/fruit',
  FruitPicShow: '/productshow/fruit',
  /*
   * Wash
   */
  BannerWash: '/banner/shoplist/wash',
  NearByWashShops: '/shoplist/wash',
  WashByShop: '/shop/wash',
  WashHot: '/hot/shoplist/wash'
};
ServiceFactory(serviceURLs);

function ServiceFactory(serviceURLs) {
  for (var p in serviceURLs) {
    (function (param) {
      angular.module('starter.services').factory(p, function ($resource) {
        return $resource(baseUrl + serviceURLs[param]);
      });
    })(p);
  }
};
'use strict';

angular.module('starter').filter('toTimeStamp', function () {
  return function (input, param) {
    return moment(input).unix() * 1000;
  };
});
'use strict';

(function () {
  var HorizontalScrollFix = function () {
    function HorizontalScrollFix($timeout, $ionicScrollDelegate) {
      return {
        restrict: 'A',
        link: function link(scope, element, attrs) {
          var mainScrollID = attrs.horizontalScrollFix,
              scrollID = attrs.delegateHandle;

          var getEventTouches = function getEventTouches(e) {
            return e.touches && (e.touches.length ? e.touches : [{
              pageX: e.pageX,
              pageY: e.pageY
            }]);
          };

          var fixHorizontalAndVerticalScroll = function fixHorizontalAndVerticalScroll() {
            var mainScroll, scroll;
            mainScroll = $ionicScrollDelegate.$getByHandle(mainScrollID).getScrollView();
            scroll = $ionicScrollDelegate.$getByHandle(scrollID).getScrollView();

            // patch touchstart
            scroll.__container.removeEventListener('touchstart', scroll.touchStart);
            scroll.touchStart = function (e) {
              var startY;
              scroll.startCoordinates = ionic.tap.pointerCoord(e);
              if (ionic.tap.ignoreScrollStart(e)) {
                return;
              }
              scroll.__isDown = true;
              if (ionic.tap.containsOrIsTextInput(e.target) || e.target.tagName === 'SELECT') {
                scroll.__hasStarted = false;
                return;
              }
              scroll.__isSelectable = true;
              scroll.__enableScrollY = true;
              scroll.__hasStarted = true;
              scroll.doTouchStart(getEventTouches(e), e.timeStamp);
              startY = mainScroll.__scrollTop;

              // below is our changes to this method
              // e.preventDefault();

              // lock main scroll if scrolling horizontal
              $timeout(function () {
                var animate, yMovement;
                yMovement = startY - mainScroll.__scrollTop;
                if (scroll.__isDragging && yMovement < 2.0 && yMovement > -2.0) {
                  mainScroll.__isTracking = false;
                  mainScroll.doTouchEnd();
                  animate = false;
                  return mainScroll.scrollTo(0, startY, animate);
                } else {
                  return scroll.doTouchEnd();
                }
              }, 100);
            };
            scroll.__container.addEventListener('touchstart', scroll.touchStart);
          };
          $timeout(function () {
            fixHorizontalAndVerticalScroll();
          });
        }
      };
    }

    return HorizontalScrollFix;
  }();

  angular.module('starter').directive('horizontalScrollFix', ['$timeout', '$ionicScrollDelegate', HorizontalScrollFix]);
}).call(undefined);
'use strict';

angular.module('starter.directives').directive('payOrder', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      order: '='
    },
    transclude: true,
    template: '<button ng-click="rePay($event, order)" ng-transclude></button>',
    controller: ["$scope", "WxPayParam", "$state", function controller($scope, WxPayParam, $state) {
      $scope.rePay = function (event, order) {
        event.stopPropagation();
        event.preventDefault();
        var data = order.orderType === 17001 ? {
          'orderIdsList': [order.orderId],
          'orderType': 17001
        } : {
          'orderIdsList': [order.orderId],
          'orderType': 17002
        };
        data.money = order.money;
        WxPayParam.set(data);
        $state.go('pay');
      };
    }]
  };
}).directive('addCart', function () {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'templateDirectives/addCart.html',
    controller: ["$scope", "$rootScope", "ShoppingCart", "UserInfo", function controller($scope, $rootScope, ShoppingCart, UserInfo) {
      $scope.$on('cartChange', function (event, data) {
        $scope.singleNumber = ShoppingCart.getGoodNumber($scope.good, $scope.shop);
        if ($scope.singleNumber > 0) {
          $scope.isHideAddCart = true;
        } else {
          $scope.isHideAddCart = false;
        }
      });
      UserInfo.then(function (user) {
        if ($scope.singleNumber > 0) {
          $scope.isHideAddCart = true;
        }
        $scope.addCart = function (event, good, shop) {
          event.stopPropagation();
          // console.log('1-->', user.verify);
          if (!(user.verify - 0)) {
            $state.go('phoneNumberCheck');
            return;
          }
          ShoppingCart.add(event, good, shop);
          $rootScope.$broadcast('cartChange');
        };
      });
    }]
  };
}).directive('cartModalIcon', function () {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'templateDirectives/cartModalIcon.html',
    controller: ["$scope", "$rootScope", "$ionicModal", "ShoppingCart", "FruitOrWash", function controller($scope, $rootScope, $ionicModal, ShoppingCart, FruitOrWash) {
      var type = FruitOrWash.get();
      $scope.$on('cartChange', function (event, data) {
        $scope.totalNumber = ShoppingCart.getshopCartNumber($scope.shop.shopId, type);
        $scope.totalMoney = ShoppingCart.getshopCartMoney($scope.shop.shopId, type);
      });
      $ionicModal.fromTemplateUrl('templateDirectives/cartModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.modal = modal;
        $scope.modal.hide();
      });
      $scope.openModal = function () {
        if ($scope.totalNumber > 0) {
          $scope.modal.show();
          $scope.cartGoods = ShoppingCart.getshopProductList($scope.shop.shopId, type);
        }
      };
      $scope.closeModal = function () {
        $scope.modal.hide();
      };
    }]
  };
}).directive('singleCart', function () {
  return {
    restrict: 'A',
    templateUrl: 'templateDirectives/singleCart.html',
    controller: ["$scope", "$rootScope", "$state", "ShoppingCart", "UserInfo", "FruitOrWash", function controller($scope, $rootScope, $state, ShoppingCart, UserInfo, FruitOrWash) {
      var type = FruitOrWash.get();
      $scope.cartAction = {};
      if ($scope.good) {
        $scope.cartAction.singleNumber = ShoppingCart.getGoodNumber($scope.good, $scope.shop, type);
      }
      UserInfo.then(function (user) {
        $scope.$on('cartChange', function (event, data) {
          $scope.cartAction.singleNumber = ShoppingCart.getGoodNumber($scope.good, $scope.shop, type);
        });
        $scope.addCart = function (event, good, shop) {
          event.stopPropagation();
          // console.log('1-->', user.verify);
          if (!(user.verify - 0)) {
            $state.go('phoneNumberCheck');
            return;
          }
          ShoppingCart.add(event, good, shop, type);
          $rootScope.$broadcast('cartChange');
        };

        $scope.removeCart = function (good, shop) {
          event.stopPropagation();
          ShoppingCart.remove(good, shop, type);
          $rootScope.$broadcast('cartChange');
        };
      });
    }]
  };
});
'use strict';

angular.module('starter.directives').directive('uHeader', function () {
  return {
    restrict: 'E',
    scope: {
      noBack: '=',
      hasSearch: '='
    },
    replace: true,
    templateUrl: './build/components/header/header.html'
  };
}).directive('goBack', function () {
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="back-wrap" ng-click="myGoBack()"> ' + '<i class="ion-arrow-left-c"></i><span>返回</span>' + '</div>',
    controller: ["$scope", "$state", "$ionicHistory", function controller($scope, $state, $ionicHistory) {
      $scope.myGoBack = function () {
        var $backView = $ionicHistory.backView();
        if ($backView) {
          $backView.go();
        } else {
          $state.go('app.index');
        }
      };
    }]
  };
}).directive('eGuard', function () {
  return {
    restrict: 'E',
    replace: true,
    template: '<p class="u-guard">管家<strong>{{eGuard.eguardName}}</strong>为您服务</p>',
    controller: ["$scope", "NearByEguard", "UserInfo", function controller($scope, NearByEguard, UserInfo) {
      UserInfo.then(function (user) {
        NearByEguard.get({
          'longitude': user.longitude,
          'latitude': user.latitude
        }, function (data) {
          $scope.eGuard = data.data[0];
        });
      });
    }]
  };
});
'use strict';

angular.module('starter.directives').directive('goodNearbyList', function () {
  return {
    restrict: 'E',
    scope: {
      listData: '=',
      listType: '@',
      listTitle: '@'
    },
    templateUrl: './build/components/index-good-list/nearby-list.html'
  };
}).directive('hotList', function () {
  return {
    restrict: 'E',
    scope: {
      hotList: '='
    },
    templateUrl: './build/components/index-good-list/hot-list.html',
    controller: ["$scope", "$timeout", "$ionicScrollDelegate", function controller($scope, $timeout, $ionicScrollDelegate) {
      $scope.$watch('hotList', function (nv) {
        if (!nv) {
          return;
        }
        nv.forEach(function (value) {
          if (value.productType == 17001) {
            value.href = '/good/fruit/' + value.productId;
          } else {
            value.href = '/shop/wash/' + value.shopId;
          }
        });
      });

      $timeout(function () {
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

        sv.touchStart = function (e) {
          e.preventDefault = function () {};
          originaltouchStart && originaltouchStart.apply(sv, [e]);
        };

        sv.touchMove = function (e) {
          e.preventDefault = function () {};
          originaltouchMove && originaltouchMove.apply(sv, [e]);
        };

        sv.mouseDown = function (e) {
          e.preventDefault = function () {};
          originalmouseDown && originalmouseDown.apply(sv, [e]);
        };

        sv.mouseMove = function (e) {
          e.preventDefault = function () {};
          originalmouseMove && originalmouseMove.apply(sv, [e]);
        };

        container.addEventListener("touchstart", sv.touchStart, false);
        container.addEventListener("mousedown", sv.mouseDown, false);
        document.addEventListener("touchmove", sv.touchMove, false);
        document.addEventListener("mousemove", sv.mouseMove, false);
      });
    }]
  };
});
'use strict';

angular.module('starter.directives').directive('scrollList', function () {
  return {
    restrict: 'E',
    scope: {
      goodList: '=',
      classList: '='
    },
    templateUrl: './build/components/scroll-list/scroll-list.html',
    controller: ["$scope", "$stateParams", "$ionicScrollDelegate", "$timeout", function controller($scope, $stateParams, $ionicScrollDelegate, $timeout) {
      var scrollObj = {};
      var indexArray = [];
      var count = 0;
      var lastId = -1;
      var indexCount = 0;

      $scope.currentIndex = 0;
      $scope.$watch('goodList', function (nv) {
        if (nv && nv.length > 0) {
          $scope.goodList.forEach(function (el, index) {
            if (el.productClassifyId != lastId) {
              lastId = el.productClassifyId;
              scrollObj[el.productClassifyId] = count;
              indexArray[count] = indexCount++;
            }
            count++;
          });
        }
      });

      $scope.scrollTo = function (classifyId, index) {
        $scope.currentIndex = index;
        $ionicScrollDelegate.$getByHandle('wash-scroll').scrollTo(0, scrollObj[classifyId] * 80, true);
        $scope.getScrollPosition = null;
        $timeout(function () {
          $scope.getScrollPosition = getOffSet;
        }, 500);
      };
      $scope.getScrollPosition = getOffSet;

      function getOffSet() {
        var currentScroll = $ionicScrollDelegate.$getByHandle('wash-scroll').getScrollPosition().top;
        var getIndex = 0;
        for (var p in scrollObj) {
          if (scrollObj[p] * 80 < currentScroll) {
            getIndex = scrollObj[p];
            continue;
          }
        }
        if ($scope.currentIndex !== indexArray[getIndex]) {
          $scope.currentIndex = indexArray[getIndex];
          $scope.getScrollPosition = null;
          $timeout(function () {
            $scope.getScrollPosition = getOffSet;
          }, 100);
        }
      }
    }]
  };
});
'use strict';

angular.module('starter.directives').directive('uAddress', function () {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      user: '='
    },
    transclude: true,
    template: '<div ng-click="getAddress()"><ng-transclude></ng-transclude></div>',
    controller: ["$scope", "$q", function controller($scope, $q) {
      var user = $scope.user || {};
      if (user.rcvPhone) {
        $scope.status.isAdded = true;
        user.rcvName = user.rcvName;
        user.rcvPhone = user.rcvPhone;
        user.rcvAddress = user.rcvAddress;
      }

      isTooFar(user.rcvAddress).then(function () {
        $scope.status.isAddressValidated = false;
      }, function () {
        $scope.status.isAddressValidated = true;
      });

      $scope.getAddress = function (event) {
        wx.ready(function () {
          wx.openAddress({
            success: function success(res) {
              var addressGot = res.provinceName + res.cityName + res.countryName + res.detailInfo;
              $scope.$apply(function () {
                user.rcvAddress = addressGot;
                user.rcvName = res.userName;
                user.rcvPhone = res.telNumber + '';
                $scope.status.isAdded = true;
                isTooFar(addressGot).then(function () {
                  $scope.status.isAddressValidated = false;
                }, function () {
                  $scope.status.isAddressValidated = true;
                });
              });
            }
          });
        });
      };

      $scope.showAlert = function () {
        var alertPopup = $ionicPopup.alert({
          title: 'U选到家',
          template: '收货地址超出您选择店面服务范围'
        });
      };

      function isTooFar(address) {
        var deferred = $q.defer();
        var gc = new BMap.Geocoder();
        address = address || '';
        gc.getPoint(address, function (point) {
          var map = new BMap.Map("allmap");
          var pointA = new BMap.Point(user.longitude, user.latitude); // 创建点坐标A
          var pointB = new BMap.Point(point.lng, point.lat); // 创建点坐标B
          var distacne = map.getDistance(pointA, pointB).toFixed(2);
          if (distacne > 6000) {
            $scope.showAlert();
            deferred.resolve(true);
          } else {
            deferred.reject(false);
          }
        });
        return deferred.promise;
      }
    }]
  };
});
'use strict';

angular.module('starter.directives').directive('cartItemList', function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: './build/components/settlement/cart-item-list.html',
    controller: ["$scope", "$rootScope", "$stateParams", "ShoppingCart", function controller($scope, $rootScope, $stateParams, ShoppingCart) {
      var type = $stateParams.type;
      $scope.type = type;
      $scope.order = {};
      if (type == 'wash' && isReserve) {
        $scope.order.carts = [];
      }

      $scope.order.isAllChecked = true;
      $scope.order.totalMoney = ShoppingCart.getTotalCartMoney(type);

      $scope.$on('cartChange', function (event, data) {
        $scope.status.isGetThroesold = ShoppingCart.isGetThroesold(type);
        $scope.order.carts = ShoppingCart.getCart(type);
        $scope.order.totalMoney = ShoppingCart.getTotalCartMoney(type);
        judgeOrder();
      });

      $scope.pickShop = function (event, shop) {
        event.stopPropagation();
        ShoppingCart.checkShop(shop, type);
        $rootScope.$broadcast('cartChange');
      };

      $scope.pickShopGood = function (event, good, shop) {
        event.stopPropagation();
        ShoppingCart.checkShopGood(type, good, shop);
        $rootScope.$broadcast('cartChange');
      };

      $scope.pickAll = function () {
        ShoppingCart.checkAll($scope.order.isAllChecked, type);
        $rootScope.$broadcast('cartChange');
      };
    }]
  };
});
'use strict';

angular.module('starter.directives').directive('guardPick', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      guard: '='
    },
    templateUrl: './build/components/settlement/guard-pick.html',
    controller: ["$scope", "NearByEguard", "UserInfo", function controller($scope, NearByEguard, UserInfo) {
      UserInfo.then(function (user) {
        NearByEguard.get({
          'longitude': user.longitude,
          'latitude': user.latitude
        }, function (data) {
          $scope.guards = data.data;
        }, function (data) {
          alert('NO DATA');
        });
      });
    }]
  };
});
'use strict';

angular.module('starter.directives').directive('uTimePick', function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: './build/components/settlement/time.html',
    controller: ["$scope", "$stateParams", function controller($scope, $stateParams) {
      var weekArray = ['日', '一', '二', '三', '四', '五', '六'];
      var date = new Date();
      var startHour = date.getHours() > 8 ? date.getHours() : 8;
      var weight = startHour >= 20 ? 1 : 0;
      $scope.tp = {};

      initDate();
      // changeDateFunction;
      $scope.changeTime = changeTimeFunction;

      function initDate() {
        $scope.tp.week = weekArray[(date.getDay() + weight) % 7];
        $scope.tp.dates = [];
        for (var i = 0 + weight; i < 8; i++) {
          $scope.tp.dates.push({
            name: addDate(date, i),
            value: i
          });
        }
        $scope.tp.preferDate = weight;
        initTime(weight);
        setOrderDate(weight);
      }

      $scope.changeDate = function changeDateFunction(index) {
        startHour = date.getHours() > 8 ? date.getHours() : 8;
        weight = startHour >= 20 ? 1 : 0;
        if ($scope.tp.preferDate > 0) {
          weight = 1;
        }
        initTime(weight);
        $scope.tp.week = weekArray[(date.getDay() + index) % 7];
        // $scope.tp.preferDate is used as index
        setOrderDate($scope.tp.preferDate);
      };

      function initTime(weight) {
        $scope.tp.times = [];
        if (weight == 0) {
          for (var i = 1; startHour + i < 21; i++) {
            $scope.tp.times.push({
              name: addZero(startHour + i) + ':00 -- ' + addZero(startHour + i) + ':30',
              value: addZero(startHour + i) + ':00 -- ' + addZero(startHour + i) + ':30'
            });
            $scope.tp.times.push({
              name: addZero(startHour + i) + ':30 -- ' + addZero(startHour + i + 1) + ':00',
              value: addZero(startHour + i) + ':30 -- ' + addZero(startHour + i + 1) + ':00'
            });
          }
        } else {
          for (var i = 8; i < 21; i++) {
            $scope.tp.times.push({
              name: addZero(i) + ':00 -- ' + addZero(i) + ':30',
              value: addZero(i) + ':00 -- ' + addZero(i) + ':30'
            });
            $scope.tp.times.push({
              name: addZero(i) + ':30 -- ' + addZero(i + 1) + ':00',
              value: addZero(i) + ':30 -- ' + addZero(i + 1) + ':00'
            });
          }
        }
        $scope.tp.preferTime = $scope.tp.times[0].value;
      }

      function changeTimeFunction(argument) {
        setOrderDate();
      }

      function setOrderDate(dayOff) {
        var pDate = addDate(date, dayOff);
        if ($scope.order) {
          $scope.order.sendTime = [date.getFullYear() + '-' + pDate + ' ' + $scope.tp.preferTime.split(' -- ')[0] + ':00', date.getFullYear() + '-' + pDate + ' ' + $scope.tp.preferTime.split(' -- ')[1] + ':00'];
        }
      }

      function addDate(date, days) {
        if (days === undefined || days === '') {
          days = 1;
        }
        var date = new Date(date);
        date.setDate(date.getDate() + days);
        var month = date.getMonth() + 1;
        var day = date.getDate();
        return addZero(month) + '-' + addZero(day);
      }

      function addZero(number) {
        if (number >= 10) {
          return number + '';
        } else {
          return '0' + '' + number;
        }
      }
    }]
  };
});
'use strict';

angular.module('starter.directives').directive('shopDetail', function () {
  return {
    restrict: 'E',
    scope: {
      img: '@',
      name: '@',
      time: '@',
      address: '@',
      tip: '@'
    },
    replace: true,
    templateUrl: './build/components/shop-detail/shop-detail.html',
    controller: ["$scope", function controller($scope) {
      $scope.img = $scope.img || 'http://lifeuxuan.com/images/washshopimage/WS0000005/1.jpg';
    }]
  };
});
'use strict';

angular.module('starter.directives').directive('shopList', function () {
  return {
    restrict: 'E',
    scope: {
      listData: '=',
      listType: '@',
      listTitle: '@'
    },
    templateUrl: './build/components/shop-list/list.html'
  };
});
'use strict';

angular.module('starter.directives').directive('bigPic', function () {
  return {
    restrict: 'A',
    scope: {},
    link: function link(scope, element, attr) {
      var picModal = $('<div class="pic-modal">').appendTo('body');
      picModal.click(function (event) {
        picModal.hide();
        picModal.empty();
      });
      element.on('click', function (event) {
        var img = $('<img>').attr('src', attr.ngSrc).css({
          'display': 'block',
          'width': '95%',
          'margin': '50px auto'
        });
        picModal.append(img).show();
      });
    }
  };
});