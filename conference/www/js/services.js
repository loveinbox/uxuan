angular.module('starter.services', ['ngResource'])

.factory('NearByEguard', function($resource, $http) {
    return $resource('http://www.lifeuxuan.com/backend/api/NearByEguard.php');
})

.factory('MainPageHot', function($resource, $http) {
    return $resource('http://www.lifeuxuan.com/backend/api/MainPageHot.php');
})

.factory('NearByFruitShops', function($resource, $http) {
    return $resource('http://www.lifeuxuan.com/backend/api/NearByFruitShops.php');
})

.factory('FruitsByShop', function($resource, $http) {
    return $resource('http://www.lifeuxuan.com/backend/api/FruitsByShop.php');
})

.factory('FruitDetail', function($resource, $http) {
    return $resource('http://www.lifeuxuan.com/backend/api/FruitDetail.php');
})

.factory('FruitPicShow', function($resource, $http) {
    return $resource('http://www.lifeuxuan.com/backend/api/FruitPicShow.php');
})

.factory('FruitUxuanRank', function($resource, $http) {
    return $resource('http://www.lifeuxuan.com/backend/api/FruitUxuanRank.php');
})

.factory('FruitOrderInsert', function($resource, $http) {
    return $resource('http://www.lifeuxuan.com/backend/api/FruitOrderInsert.php');
})

.factory('QueryOrderList', function($resource, $http) {
    return $resource('http://www.lifeuxuan.com/backend/api/QueryOrderList.php');
})

.factory('userinfo', function($resource, $http) {
    return $resource('http://www.lifeuxuan.com/backend/userinfo.php');
})

.factory('UserRegister', function($resource, $http) {
    return $resource('http://www.lifeuxuan.com/backend/api/UserRegister.php');
})

.factory('PayConfirm', function($resource, $http) {
    return $resource('http://www.lifeuxuan.com/backend/api/PayConfirm.php');
})

.factory('Location', function($rootScope, $resource, $q, userinfo) {

    console.log('start to get loction');
    var deferred = $q.defer();

    (function register() {
        $.ajax({
                url: 'http://www.lifeuxuan.com/backend/WxAddressCtrl.php',
                type: 'GET',
                dataType: 'json',
                data: {
                    'url': window.location.href.split("#")[0]
                }
            })
            .done(function(e) {
                // var rs = JSON.parse(e);
                // alert(e);
                wx.config({
                    debug: false,
                    appId: e.appId,
                    timestamp: e.timestamp,
                    nonceStr: e.nonceStr,
                    signature: e.signature,
                    jsApiList: ['checkJsApi', 'openAddress', 'getLocation']
                });
                wx.error(function(res) {});
            })
            .fail(function(e) {
                // alert(e);
            })
            .always(function() {});

    })();
    wx.ready(function() {
            wx.getLocation({
                type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                success: function(res) {
                    $rootScope.latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                    $rootScope.longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                    $rootScope.speed = res.speed; // 速度，以米/每秒计
                    $rootScope.accuracy = res.accuracy; // 位置精度
                    alert(res.latitude);
                }
            });
            userinfo.get({},
                function(e) {
                    console.log('openid', e.openid);
                    $rootScope.openid = e.openid;
                    for (var p in e) {
                        console.log(p, e[p]);
                    }
                    // var res = JSON.parse(e);
                    $rootScope.user = { name: e.nickname, img: e.headimgurl };
                    UserRegister.get({
                        'latitude': $rootScope.latitude,
                        'longitude': $rootScope.longitude,
                        'openId': e.openid,
                        'username': e.nickname,
                        'password': '',
                        'headPicUrl': e.headimgurl
                    }, function(e) {
                        console.log('userId', e.data.userId);
                        $rootScope.userid = e.data.userId;
                        deferred.resolve();
                    })
                },
                function(e) {
                    alert(e);
                    deferred.reject(e);
                })
        },
        function(e) {
            alert(e);
        });
        return deferred.promise;
})

;
