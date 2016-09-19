angular.module('starter.controllers', []);

angular.module('starter.controllers')

.run(function run($rootScope, UserInfo, UserRegister, userinfo, Location) {
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

    Location.then(function() {
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
                if(e.data){
                    UserInfo.user.userid = e.data.userId;
                    UserInfo.user.verify = e.data.verify;
                }
            })
        });
    });

})

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $rootScope, $http) {
    // var config = {
    //     headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
    //     }
    // }
    // $http.post("http://www.lifeuxuan.com/backend/api/test.php", 'asd', config)
    //     .success(function(data, status, headers, config) {
    //         $scope.data = data;
    //     }).error(function(data, status, headers, config) {
    //         $scope.status = status;
    //     });
})

.controller('SessionsCtrl', function($scope, $rootScope, $timeout, $ionicScrollDelegate, $ionicModal, UserRegister, userinfo, UserInfo, NearByEguard, MainPageHot, NearByFruitShops, FruitUxuanRank, Location, ShoppingCart) {
    Location.then(function() {
        console.log('get location', UserInfo.user.longitude, UserInfo.user.latitude);

        MainPageHot.get({
            'longitude': UserInfo.user.longitude,
            'latitude': UserInfo.user.latitude
        }, function(data) {
            $scope.sessions = data.data;
        }, function(data) {
            alert('NO DATA MainPageHot');
        });

        FruitUxuanRank.get({
            'longitude': UserInfo.user.longitude,
            'latitude': UserInfo.user.latitude,
        }, function(data) {
            $scope.goods = data.data;
        }, function(data) {
            alert('NO DATA FruitUxuanRank');
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

.controller('SessionCtrl', function($rootScope, $scope, $stateParams, $state, $ionicHistory, $ionicModal, UserInfo, FruitDetail, FruitPicShow, ShoppingCart, Location) {
    $scope.isHideAddCart = false;
    $scope.singleNumber = 0;

    var cartNumber = 0;

    Location.then(function() {
        FruitDetail.get({
            'longitude': UserInfo.user.longitude,
            'latitude': UserInfo.user.latitude,
            'productId': $stateParams.sessionId
        }, function(data) {
            $scope.session = data.data;
            cartNumber = ShoppingCart.get(data.data);
            $scope.singleNumber = cartNumber;
            $scope.cart = {
                number: ShoppingCart.getSellerCartNumber(data.data.sellerId)
            }
            if (cartNumber == 0) {
                $scope.isHideAddCart = false;
            } else {
                $scope.isHideAddCart = true;
            }
            FruitPicShow.get({
                'longitude': UserInfo.user.longitude,
                'latitude': UserInfo.user.latitude,
                'productId': $stateParams.sessionId
            }, function(data) {
                $scope.imgs = data.data;
            }, function(data) {
                alert('NO DATA');
            });
        }, function(data) {
            alert('NO DATA');
        });
    });

    $scope.$on('cartChange', function() {
        $scope.singleNumber = ShoppingCart.get(data.data);
    });


    $scope.addCart = function(event, good) {

        console.log('phone check sessions', UserInfo.user.verify);
        console.log('phone check sessions !!!', !UserInfo.user.verify);
        if (!(UserInfo.user.verify - 0)) {
            $state.go('phoneNumberCheck');
            return;
        }
        event.stopPropagation();
        cartNumber = ShoppingCart.add(event, good);
        $scope.isHideAddCart = true;
        $scope.singleNumber = cartNumber;
        $scope.cart.number = ShoppingCart.getSellerCartNumber(good.sellerId);
        $scope.cartGoods = ShoppingCart.getSellerProductList(good.sellerId);
    };

    $scope.removeCart = function(good) {
        event.stopPropagation();
        var cartNumber = ShoppingCart.remove(good);
        if (cartNumber == 0) {
            $scope.isHideAddCart = false;
        }
        $scope.singleNumber = cartNumber;
        $scope.cart.number = ShoppingCart.getSellerCartNumber(good.sellerId);
        $scope.cartGoods = ShoppingCart.getSellerProductList(good.sellerId);
        if ($scope.cart.number == 0) {
            $scope.modal.hide();
        }
    };

    $ionicModal.fromTemplateUrl('my-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function(good) {
        if ($scope.cart.number > 0) {
            $scope.modal.show();
            $scope.cartGoods = ShoppingCart.getSellerProductList(good.sellerId);
        }
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };
})

.controller('sellerListCtrl', function($scope, $rootScope, $stateParams, NearByEguard, MainPageHot, FruitUxuanRank) {
    Location.then(function() {
        NearByEguard.get({
            'longitude': $rootScope.longitude,
            'latitude': $rootScope.latitude,
        }, function(data) {
            $scope.eGuard = data.data;
        }, function(data) {
            alert('NO DATA');
        })

        MainPageHot.get({
            'longitude': $rootScope.longitude,
            'latitude': $rootScope.latitude,
        }, function(data) {
            $scope.sessions = data.data;
        }, function(data) {
            alert('NO DATA');
        });

        FruitUxuanRank.get({
            'longitude': $rootScope.longitude,
            'latitude': $rootScope.latitude,
        }, function(data) {
            $scope.goods = data.data;
        }, function(data) {
            alert('NO DATA');
        });
    });

})

.controller('sellerCtrl', function($scope, $rootScope, $stateParams, FruitsByShop, ShoppingCart, $ionicModal, UserInfo, Location) {

    $scope.cart = { number: 0 };
    Location.then(function() {
        FruitsByShop.get({
            'longitude': UserInfo.user.longitude,
            'latitude': UserInfo.user.latitude,
            'sellerId': $stateParams.sellerId
        }, function(data) {
            $scope.seller = data.data.shop;
            $scope.goods = getGoodQuuantity(data.data.shop.sellerId, data.data.products);
            $scope.totalNumber = ShoppingCart.getSellerCartNumber($scope.seller.sellerId);
        }, function(data) {
            alert('NO DATA');
        });
    });

    $ionicModal.fromTemplateUrl('my-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function() {
        $scope.modal.show();
        $scope.cartGoods = ShoppingCart.getSellerProductList($scope.seller.sellerId);
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    $scope.$on('cartChange', function() {
        $scope.totalNumber = ShoppingCart.getSellerCartNumber($scope.seller.sellerId);
    });

    $ionicModal.fromTemplateUrl('my-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function(good) {
        if ($scope.cart.number > 0) {
            $scope.modal.show();
            $scope.cartGoods = ShoppingCart.getSellerProductList(good.sellerId);
        }
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    function getGoodQuuantity(sellerId, good) {
        $.each(good, function(index, value) {
            value.quantity = ShoppingCart.getGoodsCartNumber(sellerId, value);
        })
        return good;
    }
})

.controller('OrderStatusCtrl', function($scope, $stateParams, $ionicHistory, $rootScope, orderStatus) {
    var status = orderStatus.get();
    console.log('111111111$rootScope.message', status);
    if (status == "ordered") {
        $scope.status = "下单成功,未支付";
        return;
    }
    if (status == "paied") {
        $scope.status = "支付成功";
        return;
    }
    // if ($rootScope.message == "failed") {
    $scope.status = "下单失败";
    // }
})

.controller('AccountCtrl', function($scope, userinfo, $rootScope, userinfo, UserInfo) {
    // userinfo.get({},
    //     function(e) {
    //         $rootScope.openid = e.openid;
    //         $rootScope.user = { name: e.nickname, img: e.headimgurl };
    //     });
    // $scope.user = $rootScope.user;
    // $scope.user = {
    //     name: '第三方',
    //     img: 'http://lifeuxuan.com/backend/images/18/1.jpg'
    // }
    $scope.user = UserInfo.user;

    $scope.getAddress = function() {
        wx.ready(function() {
            wx.openAddress({
                success: function(res) {},
                cancel: function() {
                    alert("fa");
                }
            });
        });
    }
})

.controller('OrdersCtrl', function($scope, $rootScope, QueryOrderList, PayConfirm, OrderCancel, UserInfo, orderStatus, $state) {
    $scope.$on("$ionicView.enter", function(event, data) {
        getOrders();
    });

    $scope.doRefresh = function() {
        console.log('Refreshing!', UserInfo.user.userid);
        getOrders();

        //Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
    }

    $scope.rePay = function(e, order) {
        e.stopPropagation();
        e.preventDefault();
        (function ForwardPay() {
            $.ajax({
                    url: 'http://www.lifeuxuan.com/backend/wxpay/pay/WxPayCtrl.php',
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        //'openId': 'oDHyIvznjdxR2KFmyAjWMs2S0lyU',
                        // 'payMoney': $scope.carts.allGoodsTotalMoney
                        'payMoney': '1'
                    }
                })
                .done(function(e) {
                    // cleanCart();
                    // alert(e);
                    wx.ready(function() {
                        // alert(e);
                        wx.chooseWXPay({
                            timestamp: e.timeStamp,
                            nonceStr: e.nonceStr,
                            package: e.package,
                            signType: e.signType,
                            paySign: e.paySign,
                            success: function(res) {
                                console.log('paied success');
                                PayConfirm.get({
                                    'longitude': UserInfo.user.longitude,
                                    'latitude': UserInfo.user.latitude,
                                    'orderId[]': [order.orderId]
                                }, function(data) {
                                    getOrders();
                                });
                            }
                        });
                    });

                })
                .fail(function(e) {})
                .always(function() {});
        })();
        // PayConfirm.get({
        //     'longitude': UserInfo.user.longitude,
        //     'latitude': UserInfo.user.latitude,
        //     'orderId': ['2016082823450561', '2016082823450560']
        // }, function(data) {
        //     getOrder();
        // });

    }

    $scope.cancel = function(e, order) {
        e.stopPropagation();
        e.preventDefault();
        OrderCancel.get({
            'longitude': UserInfo.user.longitude,
            'latitude': UserInfo.user.latitude,
            'orderId': [order.orderId]
        }, function(data) {
            getOrders();
        });
    }

    function getOrders() {
        console.log('getOrders', 'UserInfo.user.userInfo', UserInfo.user.userInfo);
        QueryOrderList.get({
            'longitude': UserInfo.user.longitude,
            'latitude': UserInfo.user.latitude,
            'userId': UserInfo.user.userid || '6'
        }, function(data) {
            $scope.orders = data.data;
        });
    }
})

.controller('orderDetailCtrl', function($scope, $rootScope, $stateParams, QueryOrderDetail, PayConfirm, UserInfo) {
    function getOrder(argument) {
        QueryOrderDetail.get({
            'longitude': UserInfo.user.longitude,
            'latitude': UserInfo.user.latitude,
            'orderId': $stateParams.orderId
        }, function(data) {
            $scope.order = data.data;
        });
    }
    getOrder();

    $scope.rePay = function(e, order) {
        e.stopPropagation();
        e.preventDefault();
        PayConfirm.get({
            'longitude': UserInfo.user.longitude,
            'latitude': UserInfo.user.latitude,
            'orderId': [$scope.order.orderId]
        }, function(data) {
            getOrder();
        });
    }
})

.controller('phoneNumberCheckCtrl', function($scope, $rootScope, $interval, UserInfo, UserRegister, SendCheckCode, CheckCheckCode, $ionicHistory) {
    var e = {};
    // UserRegister.get({
    //     'latitude': UserInfo.user.latitude,
    //     'longitude': UserInfo.user.longitude,
    //     'openId': e.openid || '123',
    //     'username': e.nickname || '123',
    //     'password': '',
    //     'headPicUrl': e.headimgurl || '123'
    // }, function(e) {
    //     UserInfo.user.userInfo = {userid: e.data.userId};
    // })

    $scope.check = {};
    $scope.check.time = 0;
    var timer = 0;

    $scope.sendCode = function(e, order) {
        if ($scope.check.time > 0) {
            return;
        }
        SendCheckCode.get({
            'longitude': UserInfo.user.longitude,
            'latitude': UserInfo.user.latitude,
            'userPhoneNumber': $scope.check.phoneNumber
        }, function(data) {
            if (data.code == -1) {
                return;
            }
            $scope.check.time = 15;
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
        CheckCheckCode.get({
            'longitude': UserInfo.user.longitude,
            'latitude': UserInfo.user.latitude,
            'userPhoneNumber': phoneNumber,
            'checkCode': $scope.check.checkCode,
            'userId': UserInfo.user.userid,
            'XDEBUG_SESSION_START': '657409A8'
        }, function(data) {
            console.log(' checkcoode data.code', data.code);
            console.log(' checkcoode data.msg', data.msg);
            if (data.code == -1) {
                alert('验证失败');
                return;
            }
            console.log('$scope.check.phoneNumber', phoneNumber);
            UserInfo.user.phoneNumber = phoneNumber;
            UserInfo.user.verify = '1';
            $ionicHistory.backView().go();
        });
    }
})

.controller('SearchCtrl', function($scope, UserInfo, Search) {

    $scope.search = {};
    $scope.searchGo = function(e, order) {
        Search.get({
            'latitude': UserInfo.user.latitude,
            'longitude': UserInfo.user.longitude,
            'keywords': $scope.search.keyword
        }, function(e) {
            $scope.search.goods = e.data.fruitProducts;
            $scope.search.sellers = e.data.fruitSellers;
        })
    }

})

;
