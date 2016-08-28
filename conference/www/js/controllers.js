angular.module('starter.controllers', ['starter.services'])

.run(function run($rootScope, UserInfo, UserRegister) {
    UserInfo.user = {};
    UserInfo.user.userid = '6';
    UserInfo.user.phoneNumber = '18788889999';
    UserInfo.user.longitude = 121.483159;
    UserInfo.user.latitude = 31.3234;
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

.controller('SessionsCtrl', function($scope, $rootScope, $timeout, $ionicScrollDelegate, UserInfo, NearByEguard, MainPageHot, NearByFruitShops, FruitUxuanRank, Location, ShoppingCart) {
    Location.then(function() {
        console.log('get location');
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


        MainPageHot.get({
            'longitude': UserInfo.user.longitude,
            'latitude': UserInfo.user.latitude
        }, function(data) {
            $scope.sessions = data.data;
        }, function(data) {
            alert('NO DATA');
        });

        FruitUxuanRank.get({
            'longitude': UserInfo.user.longitude,
            'latitude': UserInfo.user.latitude,
        }, function(data) {
            $scope.goods = data.data;
        }, function(data) {
            alert('NO DATA');
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

.controller('SessionCtrl', function($rootScope, $scope, $stateParams, $state, $ionicHistory, $ionicModal, UserInfo, FruitDetail, FruitPicShow, ShoppingCart, $ionicModal) {
    $scope.isHideAddCart = false;
    $scope.singleNumber = 0;

    var cartNumber = 0;

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

    $scope.$on('cartChange', function() {
        $scope.singleNumber = ShoppingCart.get(data.data);
    });


    $scope.addCart = function(event, good) {
        if (!UserInfo.user.phoneNumber) {
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

})

.controller('sellerCtrl', function($scope, $rootScope, $stateParams, FruitsByShop, ShoppingCart, $ionicModal) {

    $scope.cart = { number: 0 };
    FruitsByShop.get({
        'longitude': $rootScope.longitude,
        'latitude': $rootScope.latitude,
        'sellerId': $stateParams.sellerId
    }, function(data) {
        $scope.seller = data.data.shop;
        $scope.goods = getGoodQuuantity(data.data.shop.sellerId, data.data.products);
        $scope.totalNumber = ShoppingCart.getSellerCartNumber($scope.seller.sellerId);
    }, function(data) {
        alert('NO DATA');
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

.controller('OrderCtrl', function($scope, $stateParams, $ionicHistory, $rootScope, $location, $state, UserInfo, orderStatus, NearByEguard, FruitOrderInsert, PayConfirm, $http, ShoppingCart) {
    $scope.order = { orderDate: [] };
    $scope.order.guard = 1;
    $scope.orderButton = { isDisabled: true };
    $scope.carts = ShoppingCart.getCart();

    $scope.order.receiverAddress = '123';

    var orderRequestObj = {
        url: 'http://www.lifeuxuan.com/backend/api/FruitOrderInsert.php',
        data: {
            'longitude': UserInfo.user.longitude,
            'latitude': UserInfo.user.latitude,
            // 'orderTime': moment,
            'userId': UserInfo.user.userid || '1',
            'userPhoneNumber': $scope.order.receiverPhone + "",
            'userAddress': $scope.order.receiverAddress + "11",
            'userPreferTime': $scope.userPreferTime,
            'eguardId': $scope.order.guard + "",
            'isPaid': true,
            'totalMoney': $scope.carts.allGoodsTotalMoney,
            'note': $scope.order.note || "无" + "",
            'productList': ShoppingCart.getCart(),
            'username': ''
        }
    };

    function judgeOrder() {
        orderRequestObj = {
            url: 'http://www.lifeuxuan.com/backend/api/FruitOrderInsert.php',
            data: {
                'longitude': UserInfo.user.longitude,
                'latitude': UserInfo.user.latitude,
                // 'orderTime': moment,
                'userId': UserInfo.user.userid || '1',
                'userPhoneNumber': $scope.order.receiverPhone + "",
                'userAddress': $scope.order.receiverAddress + "11",
                'userPreferTime': $scope.userPreferTime,
                'eguardId': $scope.order.guard + "",
                'isPaid': true,
                'totalMoney': $scope.carts.allGoodsTotalMoney,
                'note': $scope.order.note || "无" + "",
                'productList': ShoppingCart.getCart(),
                // 'username': UserInfo.user.user.name || ''
                'username': ''
            }
        };
        if ($scope.carts.allGoodsTotalMoney > 0 && $scope.order.receiverAddress) {
            $scope.orderButton.isDisabled = false;
            $.each(orderRequestObj.data.productList, function(index, cart) {
                if (cart.seller.isReachStartPrice == false) {
                    $scope.orderButton.isDisabled = true;
                }
            });
        }
    }

    (function dateFun() {
        $scope.from = { bool: $stateParams.from > 0 };

        var weekArray = ['日', '一', '二', '三', '四', '五', '六'];
        var weight = 0;

        var date = new Date,
            startHour = date.getHours() > 8 ? date.getHours() : 8;

        if (startHour > 20) {
            weight = 1;
        }

        $scope.date = {
            week: weekArray[date.getDay() + weight]
        }

        for (var i = 0 + weight; i < 8; i++) {
            $scope.order.orderDate.push({
                name: addDate(date, i),
                value: i
            })
        }

        $scope.order.preferTimeDay = weight;

        $scope.order.orderTime = [];

        if (weight == 0) {
            for (var i = 1; startHour + i < 21; i++) {
                $scope.order.orderTime.push({
                    name: addZero(startHour + i) + ':00 -- ' + addZero(startHour + i) + ':30',
                    value: addZero(startHour + i) + ':00 -- ' + addZero(startHour + i) + ':30'
                })
                $scope.order.orderTime.push({
                    name: addZero(startHour + i) + ':30 -- ' + addZero(startHour + i + 1) + ':00',
                    value: addZero(startHour + i) + ':30 -- ' + addZero(startHour + i + 1) + ':00'
                })
            }
        } else {
            for (var i = 8; i < 21; i++) {
                $scope.order.orderTime.push({
                    name: addZero(i) + ':00 -- ' + addZero(i) + ':30',
                    value: addZero(i) + ':00 -- ' + addZero(i) + ':30'
                })
                $scope.order.orderTime.push({
                    name: addZero(i) + ':30 -- ' + addZero(i + 1) + ':00',
                    value: addZero(i) + ':30 -- ' + addZero(i + 1) + ':00'
                })
            }
        }

        if ($scope.order.orderTime.length > 0) {
            $scope.order.preferTimeTime = $scope.order.orderTime[0].value;
        }

        $scope.changeDate = function() {
            if ($scope.order.preferTimeDay > 0) {
                $scope.order.orderTime = [];
                for (var i = 8; i < 21; i++) {
                    $scope.order.orderTime.push({
                        name: addZero(i) + ':00 -- ' + addZero(i) + ':30',
                        value: addZero(i) + ':00 -- ' + addZero(i) + ':30'
                    })
                    $scope.order.orderTime.push({
                        name: addZero(i) + ':00 -- ' + addZero(i + 1) + ':00',
                        value: addZero(i) + ':00 -- ' + addZero(i + 1) + ':00'
                    })
                }
                $scope.order.preferTimeTime = $scope.order.orderTime[0].value;
            } else {
                $scope.order.orderTime = [];
                for (var i = 1; startHour + i < 21; i++) {
                    $scope.order.orderTime.push({
                        name: addZero(startHour + i) + ':00 -- ' + addZero(startHour + i) + ':30',
                        value: addZero(startHour + i) + ':00 -- ' + addZero(startHour + i) + ':30'
                    })
                    $scope.order.orderTime.push({
                        name: addZero(startHour + i) + ':30 -- ' + addZero(startHour + i + 1) + ':00',
                        value: addZero(startHour + i) + ':30 -- ' + addZero(startHour + i + 1) + ':00'
                    })
                }
                $scope.order.preferTimeTime = $scope.order.orderTime[0].value;
            }
            $scope.date = {
                week: weekArray[(date.getDay() + $scope.order.preferTimeDay) % 7]
            }
        }
    })();

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

    NearByEguard.get({
        'longitude': $rootScope.longitude,
        'latitude': $rootScope.latitude,
    }, function(data) {
        $scope.eGuard = data.data;
    }, function(data) {
        alert('NO DATA');
    });

    $scope.calculateMoney = function(event, cart) {
        $scope.isAllChecked = false;
        $.each(cart.goodsList, function(index, value) {
            value.isChecked = cart.isChecked;
        });
        cartList();
    }

    $scope.calculateSingleMoney = function(event, cart) {
        event.stopPropagation();
        var isAllSelected = true;
        $scope.isAllChecked = false;
        // is all goods selected
        $.each(cart.goodsList, function(index, value) {
            if (!value.isChecked) {
                isAllSelected = false;
            }
        });
        cart.isChecked = isAllSelected;
        cartList();
    }

    $scope.pickAll = function() {
        cartListInit($scope.order.isAllChecked);
    }

    cartListInit(true);

    function cartListInit(isCheck) {
        var carts = ShoppingCart.getCart();
        $scope.carts = carts;
        $scope.carts.allGoodsTotalMoney = 0;
        $scope.order.isAllChecked = isCheck;

        $.each(carts, function(index, cart) {
            var tempTotalMoney = 0;
            if (cart.isChecked == undefined) {
                cart.isChecked = isCheck;
            }
            $.each(cart.goodsList, function(index, value) {
                if (value.isChecked == undefined) {
                    value.isChecked = isCheck;
                }
                if (value.isChecked) {
                    tempTotalMoney += value.price * value.quantity;
                }
            });
            $scope.carts.allGoodsTotalMoney += cart.seller.totalMoney = tempTotalMoney + cart.seller.sendPrice * 100;
            if (cart.seller.totalMoney <= cart.seller.sendStartPrice * 100) {
                cart.seller.isReachStartPrice = false;
            } else {
                cart.seller.isReachStartPrice = true;
            }
        });
        judgeOrder();
    };

    function cartList() {
        $scope.carts.allGoodsTotalMoney = 0;
        $.each($scope.carts, function(index, cart) {
            var tempTotalMoney = 0;
            $.each(cart.goodsList, function(index, value) {
                if (value.isChecked) {
                    tempTotalMoney += value.price * value.quantity;
                }
            });
            cart.seller.totalMoney = tempTotalMoney;
            // 是否计算运费
            if (tempTotalMoney > 0) {
                cart.seller.totalMoney += cart.seller.sendPrice * 100;
            }
            // 是否达到起送价
            if (cart.seller.totalMoney <= cart.seller.sendStartPrice * 100) {
                cart.seller.isReachStartPrice = false;
            } else {
                cart.seller.isReachStartPrice = true;
            }
            $scope.carts.allGoodsTotalMoney += cart.seller.totalMoney;
        });
        localStorage.setItem('cart', JSON.stringify($scope.carts));
        judgeOrder();
    };

    function cleanCart() {
        var carts = ShoppingCart.getCart();
        for (var i = carts.length - 1; i >= 0; i--) {
            if (carts[i]) {
                if (carts[i].isChecked) {
                    carts.splice(i, 1);
                } else {
                    for (var j = carts[i].goodsList.length - 1; j >= 0; j--) {
                        if (carts[i].goodsList[j] && carts[i].goodsList[j].isChecked) {
                            carts[i].goodsList.splice(j, 1);
                        }
                    }
                }
            }
        }
        localStorage.setItem('cart', JSON.stringify(carts));
    }

    $scope.confirmOrder = function() {
        if ($scope.orderButton.isDisabled) {
            return;
        }
        var date = new Date();
        // var moment = addZero(date.getFullYear()) + '-' + addZero(date.getMonth()) + '-' + addZero(date.getDate()) + ' ' + addZero(date.getHours()) + ':' + addZero(date.getMinutes()) + ':' + addZero(date.getSeconds());
        var pDate = addDate(date, $scope.order.preferTimeDay);
        $scope.userPreferTime = [
            date.getFullYear() + '-' + pDate + ' ' + $scope.order.preferTimeTime.split(' -- ')[0] + ':00',
            date.getFullYear() + '-' + pDate + ' ' + $scope.order.preferTimeTime.split(' -- ')[1] + ':00'
        ];

        var orderIds = null;
        orderRequestObj = {
            url: 'http://www.lifeuxuan.com/backend/api/FruitOrderInsert.php',
            data: {
                'longitude': UserInfo.user.longitude,
                'latitude': UserInfo.user.latitude,
                // 'orderTime': moment,
                'userId': UserInfo.user.userid || '1',
                'userPhoneNumber': $scope.order.receiverPhone + "",
                'userAddress': $scope.order.receiverAddress + "11",
                'userPreferTime': $scope.userPreferTime,
                'eguardId': $scope.order.guard + "",
                'isPaid': true,
                'totalMoney': $scope.carts.allGoodsTotalMoney,
                'note': $scope.order.note || "无" + "",
                'productList': ShoppingCart.getCart(),
                // 'username': UserInfo.user.user.name || ''
                'username': ''
            }
        };
        $.ajax(orderRequestObj)
            .done(function(e) {
                var data = JSON.parse(e);
                console.log(data.message);
                $scope.$apply(function() {
                    if (data.code != -1) {
                        ForwardPay();
                        orderIds = data;
                        console.log('data', data);
                    } else {
                        orderStatus.failed();
                        $state.go('orderStatus');
                    }
                })
            })
            .fail(function(e) {
                console.log(e);
                console.log("error");
            })
            .always(function() {
                console.log("complete");
            });

        function ForwardPay() {

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
                                orderStatus.paied();
                                console.log('paied success');
                                $state.go('orderStatus');
                                console.log('orderIds', orderIds);
                                PayConfirm.get({
                                    'longitude': UserInfo.user.longitude,
                                    'latitude': UserInfo.user.latitude,
                                    'orderId': orderIds
                                }, function(data) {});
                            },
                            cancel: function(res) {
                                orderStatus.ordered();
                                console.log('ordered success');
                                $state.go('orderStatus');
                            },
                            complete: function(res) {
                                cleanCart();
                            }

                        });
                    });

                })
                .fail(function(e) {})
                .always(function() {});
        };

        // $state.go('orderStatus');
    }

    $scope.getAddress = function() {
        wx.ready(function() {
            wx.openAddress({
                success: function(res) {
                    $scope.$apply(function() {
                        $scope.order.receiverAddress = res.provinceName + res.cityName + res.countryName + res.detailInfo || '';
                        $scope.order.receiverName = res.userName;
                        $scope.order.receiverPhone = res.telNumber - 0;

                        var carts = ShoppingCart.getCart();
                        if ($scope.carts.allGoodsTotalMoney > 0) {
                            $scope.orderButton.status = false;
                        }
                    });
                },
                cancel: function() {
                    alert("fa");
                }
            });
        });
    }

    $scope.addCart = function(event, good) {
        event.stopPropagation();
        event.preventDefault();
        cartNumber = ShoppingCart.add(event, good);
        cartList();
    };

    $scope.removeCart = function(good) {
        event.stopPropagation();
        event.preventDefault();
        var cartNumber = ShoppingCart.remove(good);
        cartList();
    };

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
    console.log('user', $scope.user);
    console.log('user name', $scope.user.nickname);
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

.controller('OrdersCtrl', function($scope, $rootScope, QueryOrderList, PayConfirm, OrderCancel, UserInfo) {
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
                                orderStatus.paied();
                                console.log('paied success');
                                $state.go('orderStatus');
                                console.log('orderIds', orderIds);
                                PayConfirm.get({
                                    'longitude': UserInfo.user.longitude,
                                    'latitude': UserInfo.user.latitude,
                                    'orderId': [order.orderId]
                                }, function(data) {});
                            },
                            cancel: function(res) {
                                orderStatus.ordered();
                                console.log('ordered success');
                                $state.go('orderStatus');
                            },
                            complete: function(res) {
                                cleanCart();
                            }

                        });
                    });

                })
                .fail(function(e) {})
                .always(function() {});
        })();
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
        QueryOrderList.get({
            'longitude': UserInfo.user.longitude,
            'latitude': UserInfo.user.latitude,
            'userId': UserInfo.user.userInfo || '6'
        }, function(data) {
            $scope.orders = data.data;
        });
    }
})

.controller('orderDetailCtrl', function($scope, $rootScope, $stateParams, QueryOrderDetail, PayConfirm) {
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
            $ionicHistory.backView().go();
        });
    }
})

;
