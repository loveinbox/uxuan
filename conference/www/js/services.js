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

.factory('OrderCancel', function($resource, $http) {
    return $resource('http://www.lifeuxuan.com/backend/api/OrderCancel.php');
})

.factory('Location', function($rootScope, $resource, $q, $timeout, userinfo, UserRegister, UserInfo) {

    console.log('start to get loction');
    var deferred = $q.defer();
    var userInfo = JSON.parse(localStorage.getItem('userinfo'));
    if (userInfo && userInfo.user.isSearchGeo && userInfo.user.latitude && userInfo.user.longitude) {
        UserInfo.user.latitude = userInfo.user.latitude;
        UserInfo.user.longitude = userInfo.user.longitude;
        wx.ready(function() {
            userinfo.get({}, function(e) {
                    UserInfo.user.name = e.nickname;
                    UserInfo.user.img = e.headimgurl;
                    UserInfo.user.openid = e.openid;
                    UserRegister.get({
                        'latitude': UserInfo.user.latitude,
                        'longitude': UserInfo.user.longitude,
                        'openId': e.openid,
                        'username': e.nickname,
                        'password': '',
                        'headPicUrl': e.headimgurl
                    }, function(e) {
                        UserInfo.user.userid = e.data.userId;
                        console.log('UserInfo.user.userid', UserInfo.user.userid);
                        deferred.resolve();
                    })
                },
                function(e) {
                    alert(e);
                    deferred.reject(e);
                })
        })
    } else {
        wx.ready(function() {
                wx.getLocation({
                    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                    success: function(res) {
                        UserInfo.user.latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                        UserInfo.user.longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                        UserInfo.user.speed = res.speed; // 速度，以米/每秒计
                        UserInfo.user.accuracy = res.accuracy; // 位置精度
                        UserInfo.user.isSearchGeo = false;
                        localStorage.setItem('userinfo', JSON.stringify(UserInfo));
                        userinfo.get({}, function(e) {
                                UserInfo.user.name = e.nickname;
                                UserInfo.user.img = e.headimgurl;
                                UserInfo.user.openid = e.openid;
                                UserRegister.get({
                                    'latitude': UserInfo.user.latitude,
                                    'longitude': UserInfo.user.longitude,
                                    'openId': e.openid,
                                    'username': e.nickname,
                                    'password': '',
                                    'headPicUrl': e.headimgurl
                                }, function(e) {
                                    UserInfo.user.userid = e.data.userId;
                                    console.log('UserInfo.user.userid', UserInfo.user.userid);
                                    deferred.resolve();
                                })
                            },
                            function(e) {
                                alert(e);
                                deferred.reject(e);
                            })
                    }
                });
            },
            function(e) {
                alert(e);
                deferred.reject(e);
            });
    }

    $timeout(function() {
        UserInfo.user.userid = '6';
        UserInfo.user.phoneNumber = '18788889999';
        UserInfo.user.longitude = 121.4444;
        UserInfo.user.latitude = 31.3333;
        localStorage.setItem('userinfo', JSON.stringify(UserInfo));
        deferred.resolve();
    }, 1000);
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

.service('orderStatus', function($rootScope, $resource, $q, userinfo, UserRegister) {
    var status = '';
    this.ordered = function() {
        stauts = 'ordered';
    }
    this.paied = function() {
        stauts = 'paied';
    }
    this.failed = function() {
        stauts = 'failed';
    }
    this.get = function() {
        return stauts;
    }
})

.factory('QueryOrderDetail', function($rootScope, $resource, $q, userinfo, UserRegister) {
    return $resource('http://www.lifeuxuan.com/backend/api/QueryOrderDetail.php');
})

.factory('SendCheckCode', function($resource) {
    return $resource('http://www.lifeuxuan.com/backend/api/SendCheckCode.php');
})

.factory('CheckCheckCode', function($resource) {
    return $resource('http://www.lifeuxuan.com/backend/api/CheckCheckCode.php');
})

.factory('Search', function($resource) {
    return $resource('http://www.lifeuxuan.com/backend/api/Search.php');
})

.service('UserInfo', function($resource) {
    this.user = {
        'userId': '',
        'latitude': '',
        'longitude': '',
        'openId': '',
        'username': '',
        'password': '',
        'headPicUrl': '',
        'phoneNumber': ''
    }
})


;
