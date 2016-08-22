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

.factory('Location', function($rootScope, $resource, $q, userinfo, UserRegister) {

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
                    // alert(res.latitude);
                    (function() {
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
                                    'latitude': $rootScope.latitude || 121.483159,
                                    'longitude': $rootScope.longitude || 31.3234,
                                    'openId': e.openid,
                                    'username': e.nickname,
                                    'password': '',
                                    'headPicUrl': e.headimgurl
                                }, function(e) {
                                    console.log('user register e', e);
                                    for (var p in e) {
                                        console.log(p, e[p]);
                                    }
                                    console.log('userId', e.data.userId);
                                    $rootScope.userid = e.data.userId;
                                    deferred.resolve();
                                })
                            },
                            function(e) {
                                alert(e);
                                deferred.reject(e);
                            })
                    })();
                },
                cancel: function (res) {
                    console.log('location cancel', res);
                },
                error: function (res) {
                    console.log('location error', res);
                }
            });
        },
        function(e) {
            alert(e);
        });
    return deferred.promise;
})

.service('ShoppingCart', function($rootScope, $resource, $q, userinfo, UserRegister) {

    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    var number = 1;
    this.add = function(event, good) {
        cartFly();

        var cartGood = {
            'sellerId': good.sellerId,
            'seller': {
                sellerName: good.sellerName,
                sellerPicUrl: good.sellerPicUrl,
                sendPrice: good.sendPrice,
                sendStartPrice: good.sendStartPrice
            },
            'goodsList': [good]
        }
        var sellerIndex = _.findIndex(cart, { 'sellerId': good.sellerId });
        // 商店第一次被添加
        if (sellerIndex < 0) {
            good.quantity = 1;
            cart.push(cartGood);
            number = 1;
        } else {
            var goodIndex = _.findIndex(cart[sellerIndex]['goodsList'], { 'productId': good.productId });
            // 商品第一次被添加
            if (goodIndex < 0) {
                good.quantity = 1;
                cart[sellerIndex]['goodsList'].push(good);
                number = 1;
            } else {
                // 商品第二次被添加
                number = ++cart[sellerIndex]['goodsList'][goodIndex]['quantity'];
            }
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        return number;
    }

    this.remove = function(good) {
        var sellerIndex = _.findIndex(cart, { 'sellerId': good.sellerId });
        var goodIndex = _.findIndex(cart[sellerIndex]['goodsList'], { 'productId': good.productId });
        var number = --cart[sellerIndex]['goodsList'][goodIndex]['quantity'];
        if (number == 0) {
            cart[sellerIndex]['goodsList'].splice([goodIndex], 1);
            if (cart[sellerIndex]['goodsList'].length == 0) {
                cart.splice(sellerIndex, 1);
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            return 0;
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            return cart[sellerIndex]['goodsList'][goodIndex]['quantity'];
        }
    }

    this.getCart = function(good) {
        return cart;
    }

    this.get = function(good) {
        var sellerIndex = _.findIndex(cart, { 'sellerId': good.sellerId });
        if (sellerIndex < 0) {
            return 0;
        } else {
            var goodIndex = _.findIndex(cart[sellerIndex]['goodsList'], { 'productId': good.productId });
            if (goodIndex < 0) {
                return 0;
            } else {
                return cart[sellerIndex]['goodsList'][goodIndex]['quantity'];
            }
        }
    }

    this.getSellerCartNumber = function(sellerId) {
        var sellerIndex = _.findIndex(cart, { 'sellerId': sellerId });
        var sellerCartNumber = 0;
        var goodCartNumber = 0;
        if (sellerIndex < 0) {
            return 0;
        } else {
            $.each(cart[sellerIndex]['goodsList'], function(index, value) {
                sellerCartNumber += value.quantity;
            });
            return sellerCartNumber;
        }
    }

    this.getSellerProductList = function(sellerId) {
        var sellerIndex = _.findIndex(cart, { 'sellerId': sellerId });
        if (sellerIndex < 0) {
            return [];
        } else {
            return cart[sellerIndex]['goodsList'];
        }
    }

    this.getGoodsCartNumber = function(sellerId, good) {
        var sellerIndex = _.findIndex(cart, { 'sellerId': sellerId });
        var sellerCartNumber = 0;
        var goodCartNumber = 0;
        if (sellerIndex < 0) {
            return 0;
        } else {
            var goodIndex = _.findIndex(cart[sellerIndex]['goodsList'], { 'productId': good.productId });
            if (goodIndex < 0) {
                return 0;
            } else {
                return cart[sellerIndex]['goodsList'][goodIndex]['quantity'];
            }
        }
    }

    function cartFly() {
        if ($(".icon-cart:visible").length < 1) {
            return;
        }
        var offset = $(".icon-cart:visible").offset();

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
            onEnd: function() {
                this.destory();
            }
        });
    }

})

;
