angular.module('starter.controllers')
.controller('OrderCtrl', function($scope, $stateParams, $ionicHistory, $rootScope, $location, $state, UserInfo, orderStatus, NearByEguard, FruitOrderInsert, PayConfirm, $http, ShoppingCart) {
    $scope.order = { orderDate: [] };
    $scope.order.guard = 1;
    $scope.orderButton = { isDisabled: true };
    $scope.carts = ShoppingCart.getCart();

    // $scope.order.receiverAddress = '123';

    var orderRequestObj = {
        url: 'http://www.lifeuxuan.com/backend/api/FruitOrderInsert.php',
        data: {
            'longitude': UserInfo.user.longitude,
            'latitude': UserInfo.user.latitude,
            // 'orderTime': moment,
            'userId': UserInfo.user.userid || '1',
            'userPhoneNumber': $scope.order.receiverPhone + "",
            'userAddress': $scope.order.receiverAddress,
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
                'userAddress': $scope.order.receiverAddress,
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
                'userAddress': $scope.order.receiverAddress,
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
                        orderIds = data.data;
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
                                console.log('111 orderIds', orderIds);
                                console.log('111 orderIds is Array', Array.isArray(orderIds));
                                PayConfirm.get({
                                    'longitude': UserInfo.user.longitude,
                                    'latitude': UserInfo.user.latitude,
                                    'orderId\[\]': orderIds
                                }, function(data) {                                    
                                    console.log('pay PayConfirm');
                                    $state.go('orderStatus');
                                });
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
                        judgeOrder();
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