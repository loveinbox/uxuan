angular.module('starter.controllers', ['starter.services'])

.run(function run($scope, $rootScope, userinfo, UserRegister) {
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
                alert('oepnID');
                alert(e.openid);
                $rootScope.openid = e.openid;
                // var res = JSON.parse(e);
                $scope.user = $rootScope.user = { name: e.nickname };
                $scope.user = $rootScope.user = { img: e.headimgurl };
                UserRegister.get({
                    'latitude': $rootScope.latitude,
                    'longitude': $rootScope.longitude,
                    'openId': e.openid
                }, function(e) {
                    alert('userID');
                    alert(e.data);
                    alert(e.data.userId);
                    $rootScope.userid = e.data.userId;
                    })
                }, function(e) {
                    alert(e);
                })
            },
            function(e) {
                alert(e);
            });
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $rootScope) {
    $rootScope.goods = new Map;
    $rootScope.totalPrice = 0;
})

.controller('SessionsCtrl', function($scope, $rootScope, NearByEguard, MainPageHot, NearByFruitShops, FruitUxuanRank) {
    $scope.options = {
        // loop: false,
        effect: 'fade',
        // speed: 3500,
    }

    $scope.$on("$ionicSlides.sliderInitialized", function(event, data) {
        // data.slider is the instance of Swiper
        $scope.slider = data.slider;
    });

    $scope.$on("$ionicSlides.slideChangeStart", function(event, data) {
        console.log('Slide change is beginning');
    });

    $scope.$on("$ionicSlides.slideChangeEnd", function(event, data) {
        // note: the indexes are 0-based
        $scope.activeIndex = data.activeIndex;
        $scope.previousIndex = data.previousIndex;
    });

    NearByEguard.get({
        'longitude': $rootScope.longitude || 121.470257,
        'latitude': $rootScope.latitude || 31.3234,
    }, function(data) {
        $scope.eGuard = data.data[0];
    }, function(data) {
        alert('NO DATA');
    });

    MainPageHot.get({
        'longitude': $rootScope.longitude || 121.470257,
        'latitude': $rootScope.latitude || 31.3234,
    }, function(data) {
        $scope.sessions = data.data;
    }, function(data) {
        alert('NO DATA');
    });

    FruitUxuanRank.get({
        'longitude': $rootScope.longitude || 121.470257,
        'latitude': $rootScope.latitude || 31.3234,
    }, function(data) {
        $scope.goods = data.data;
    }, function(data) {
        alert('NO DATA');
    });

    // $scope.sessions = [{
    //     'shopId':'1123',
    //     'shopName':'苗先生',
    //     'distance':'0.1km',
    //     'productId':'3123123',
    //     'goodName':'南汇 马陆品种葡萄（一盒）5斤以上',
    //     'goodListPic':'src1',
    //     'price':'12.5'
    // },
    // {
    //     'shopId':'1123',
    //     'shopName':'苗先生',
    //     'distance':'0.1km',
    //     'productId':'3123123',
    //     'goodName':'南汇 马陆品种葡萄（一盒）5斤以上',
    //     'goodListPic':'src1',
    //     'price':'12.5'
    // },
    // {
    //     'shopId':'1123',
    //     'shopName':'苗先生',
    //     'distance':'0.1km',
    //     'productId':'3123123',
    //     'goodName':'南汇 马陆品种葡萄（一盒）5斤以上',
    //     'goodListPic':'src1',
    //     'price':'12.5'
    // },
    // {
    //     'shopId':'1123',
    //     'shopName':'苗先生',
    //     'distance':'0.1km',
    //     'productId':'3123123',
    //     'goodName':'南汇 马陆品种葡萄（一盒）5斤以上',
    //     'goodListPic':'src1',
    //     'price':'12.5'
    // }];

    $scope.addCart = function($event) {
        $event.stopPropagation();
        $event.preventDefault();
        var offset = $(".ion-ios-cart:visible").offset();

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
        return false;
    };
})

.controller('SessionCtrl', function($rootScope, $scope, $stateParams, $ionicHistory, $ionicModal, FruitDetail, FruitPicShow) {
    $rootScope.goods = $rootScope.goods || new Map;
    $scope.isHideAddCart = false;
    $scope.singleNumber = 0;
    $scope.allNumber = $rootScope.goods.size;
    $rootScope.totalPrice = $rootScope.totalPrice || 0;

    // $scope.session = {
    //     'shopId':'1123',
    //     '':'苗先生',
    //     'distance':'0.1km',
    //     'productId':'3123123',
    //     'goodName':'南汇 马陆品种葡萄（一盒）5斤以上',
    //     'goodListPic':'src1',
    //     'price':'12.5'
    // }

    FruitDetail.get({
        'longitude': $rootScope.longitude || 121.470257,
        'latitude': $rootScope.latitude || 31.3234,
        'productId': $stateParams.sessionId
    }, function(data) {
        $scope.session = data.data;
        FruitPicShow.get({
            'longitude': $rootScope.longitude || 121.470257,
            'latitude': $rootScope.latitude || 31.3234,
            'productId': $stateParams.sessionId
        }, function(data) {
            $scope.imgs = data.data;
        }, function(data) {
            alert('NO DATA');
        });
    }, function(data) {
        alert('NO DATA');
    });

    $scope.addCart = function(event) {
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
        // $scope.session.timeId = Date.now();
        if ($rootScope.goods.has($scope.session.productId)) {
            $rootScope.goods.get($scope.session.productId).buyNumber++;
        } else {
            $scope.session.buyNumber = 1;
            $rootScope.goods.set($scope.session.productId, $scope.session);
        }
        $scope.allNumber++;
        // $scope.allNumber = $rootScope.goods.size;
        $scope.singleNumber++;
        $scope.isHideAddCart = true;
        var tempPrice = 0;
        $rootScope.goods.forEach(function(value, key) {
            tempPrice += value.price * value.buyNumber;
        })
        $rootScope.totalPrice = tempPrice / 100;
    };

    $scope.removeCart = function(event) {
        // var buyNumber = $rootScope.goods.get($scope.session.productId).buyNumber;
        if ($scope.singleNumber <= 0) {
            return;
        }
        var num = $rootScope.goods.get($scope.session.productId).buyNumber--;
        // $scope.allNumber--;
        if (num === 0) {
            $rootScope.goods.delete($scope.session.productId);
        }

        $scope.allNumber--;
        // $scope.allNumber = $rootScope.goods.size;
        $scope.singleNumber--;
        // $scope.isHideAddCart = true;
        var tempPrice = 0;
        $rootScope.goods.forEach(function(value, key) {
            tempPrice += value.price * value.buyNumber;
        })
        $rootScope.totalPrice = tempPrice;
    };


    $ionicModal.fromTemplateUrl('my-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function() {
        $scope.modal.show();
        var tempGoods = [];
        $rootScope.goods.forEach(function(value, key) {
            tempGoods.push(value);
        })
        $scope.goods = tempGoods;
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
        // Execute action
    });
})

.controller('sellerListCtrl', function($scope, $rootScope, $stateParams, NearByEguard, MainPageHot, FruitUxuanRank) {
    NearByEguard.get({
        'longitude': $rootScope.longitude || 121.470257,
        'latitude': $rootScope.latitude || 31.3234,
    }, function(data) {
        $scope.eGuard = data.data;
    }, function(data) {
        alert('NO DATA');
    })

    MainPageHot.get({
        'longitude': $rootScope.longitude || 121.470257,
        'latitude': $rootScope.latitude || 31.3234,
    }, function(data) {
        $scope.sessions = data.data;
    }, function(data) {
        alert('NO DATA');
    });

    FruitUxuanRank.get({
        'longitude': $rootScope.longitude || 121.470257,
        'latitude': $rootScope.latitude || 31.3234,
    }, function(data) {
        $scope.goods = data.data;
    }, function(data) {
        alert('NO DATA');
    });

    // $scope.sessions = [{
    //     'shopId':'1123',
    //     'shopName':'苗先生',
    //     'distance':'0.1km',
    //     'productId':'3123123',
    //     'goodName':'南汇 马陆品种葡萄（一盒）5斤以上',
    //     'goodListPic':'src1',
    //     'price':'12.5'
    // },
    // {
    //     'shopId':'1123',
    //     'shopName':'苗先生',
    //     'distance':'0.1km',
    //     'productId':'3123123',
    //     'goodName':'南汇 马陆品种葡萄（一盒）5斤以上',
    //     'goodListPic':'src1',
    //     'price':'12.5'
    // },
    // {
    //     'shopId':'1123',
    //     'shopName':'苗先生',
    //     'distance':'0.1km',
    //     'productId':'3123123',
    //     'goodName':'南汇 马陆品种葡萄（一盒）5斤以上',
    //     'goodListPic':'src1',
    //     'price':'12.5'
    // },
    // {
    //     'shopId':'1123',
    //     'shopName':'苗先生',
    //     'distance':'0.1km',
    //     'productId':'3123123',
    //     'goodName':'南汇 马陆品种葡萄（一盒）5斤以上',
    //     'goodListPic':'src1',
    //     'price':'12.5'
    // }];

    $scope.addCart = function($event) {
        $event.stopPropagation();
        $event.preventDefault();
        var offset = $(".ion-ios-cart:visible").offset();

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
        return false;
    }
})

.controller('sellerCtrl', function($scope, $rootScope, $stateParams, FruitsByShop) {

    FruitsByShop.get({
        'longitude': $rootScope.longitude || 121.470257,
        'latitude': $rootScope.latitude || 31.3234,
        'sellerId': $stateParams.sellerId
    }, function(data) {
        $scope.seller = data.data.shop;
        $scope.goods = data.data.products;
    }, function(data) {
        alert('NO DATA');
    })

    // $scope.seller = {
    //     'shopId':'1123',
    //     'shopName':'苗先生',
    //     'distance':'0.1km',
    //     'productId':'3123123',
    //     'goodName':'南汇 马陆品种葡萄（一盒）5斤以上',
    //     'goodListPic':'src1',
    //     'price':'12.5'
    // };

    // $scope.sessions = [{
    //     'shopId':'1123',
    //     'shopName':'苗先生',
    //     'distance':'0.1km',
    //     'productId':'3123123',
    //     'goodName':'南汇 马陆品种葡萄（一盒）5斤以上',
    //     'goodListPic':'src1',
    //     'price':'12.5'
    // },
    // {
    //     'shopId':'1123',
    //     'shopName':'苗先生',
    //     'distance':'0.1km',
    //     'productId':'3123123',
    //     'goodName':'南汇 马陆品种葡萄（一盒）5斤以上',
    //     'goodListPic':'src1',
    //     'price':'12.5'
    // },
    // {
    //     'shopId':'1123',
    //     'shopName':'苗先生',
    //     'distance':'0.1km',
    //     'productId':'3123123',
    //     'goodName':'南汇 马陆品种葡萄（一盒）5斤以上',
    //     'goodListPic':'src1',
    //     'price':'12.5'
    // },
    // {
    //     'shopId':'1123',
    //     'shopName':'苗先生',
    //     'distance':'0.1km',
    //     'productId':'3123123',
    //     'goodName':'南汇 马陆品种葡萄（一盒）5斤以上',
    //     'goodListPic':'src1',
    //     'price':'12.5'
    // }];

    $scope.addCart = function($event) {
        $event.stopPropagation();
        $event.preventDefault();
        var offset = $(".ion-ios-cart:visible").offset();

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
        return false;
    };
})

.controller('OrderCtrl', function($scope, $stateParams, $ionicHistory, $rootScope, $location, $state, NearByEguard, FruitOrderInsert) {
    $rootScope.goods = $rootScope.goods || new Map;
    $rootScope.totalPrice = $rootScope.totalPrice || 0;
    $scope.order = {};
    $scope.order.guard = 1;

    var date = new Date,
        today = date.getMonth() + 1 + '月' + date.getDate() + '日',
        tomorrow = date.getMonth() + 1 + '月' + (date.getDate() + 1) + '日',
        startHour = date.getHours() > 8 ? date.getHours() : 8;

    $scope.order.orderDate = [
        { name: '今日（' + today + '）', value: today },
        { name: '明日（' + tomorrow + '）', value: tomorrow }
    ];
    $scope.order.preferTimeDay = today;

    $scope.order.orderTime = [];

    for (var i = 0; startHour + i < 21; i++) {
        $scope.order.orderTime.push({
            name: addZero(startHour + i) + ':00 -- ' + addZero(startHour + i + 1) + ':00',
            value: addZero(startHour + i) + ':00 -- ' + addZero(startHour + i + 1) + ':00'
        })
    }
    $scope.order.preferTimeTime = $scope.order.orderTime[0].value;

    $scope.changeDate = function() {
        if ($scope.order.preferTimeDay != today) {
            $scope.order.orderTime = [];
            for (var i = 8; i < 21; i++) {
                $scope.order.orderTime.push({
                    name: addZero(i) + ':00 -- ' + addZero(i + 1) + ':00',
                    value: addZero(i) + ':00 -- ' + addZero(i + 1) + ':00'
                })
            }
            $scope.order.preferTimeTime = $scope.order.orderTime[0].value;
        } else {
            $scope.order.orderTime = [];
            for (var i = 0; startHour + i < 21; i++) {
                $scope.order.orderTime.push({
                    name: addZero(startHour + i) + ':00 -- ' + addZero(startHour + i + 1) + ':00',
                    value: addZero(startHour + i) + ':00 -- ' + addZero(startHour + i + 1) + ':00'
                })
            }
            $scope.order.preferTimeTime = $scope.order.orderTime[0].value;
        }
    }

    NearByEguard.get({
        'longitude': $rootScope.longitude || 121.470257,
        'latitude': $rootScope.latitude || 31.3234,
    }, function(data) {
        $scope.eGuard = data.data;
    }, function(data) {
        alert('NO DATA');
    });

    var tempGoods = [];
    var tempPrice = 0;
    var tempOrderGoodList = [];
    $rootScope.goods.forEach(function(value, key) {
        tempPrice += value.price * value.buyNumber;
        tempGoods.push(value);
        var index = _.findIndex(tempOrderGoodList, { 'sellerId': value.sellerId });
        if (index < 0) {
            tempOrderGoodList.push({
                'sellerId': value.sellerId,
                'totalMoney': value.price * value.buyNumber,
                'goodsList': [{
                    'id': value.productId,
                    'price': value.price,
                    'quantity': value.buyNumber
                }]
            })
        } else {
            tempOrderGoodList[index]['goodsList'].push({
                'id': value.productId,
                'price': value.price,
                'quantity': value.buyNumber
            })
            tempOrderGoodList[index]['totalMoney'] += value.price * value.buyNumber;
        }
    })
    $scope.goods = tempGoods;
    $rootScope.totalPrice = tempPrice / 100;

    $scope.confirmOrder = function() {

        var date = new Date();
        // var moment = addZero(date.getFullYear()) + '-' + addZero(date.getMonth()) + '-' + addZero(date.getDate()) + ' ' + addZero(date.getHours()) + ':' + addZero(date.getMinutes()) + ':' + addZero(date.getSeconds());
        var pDate = addZero($scope.order.preferTimeDay.replace('日', '').split('月')[0]) + '-' + addZero($scope.order.preferTimeDay.replace('日', '').split('月')[1]);
        var userPreferTime = [
            date.getFullYear() + '-' + pDate + ' ' + $scope.order.preferTimeTime.split(' -- ')[0] + ':00',
            date.getFullYear() + '-' + pDate + ' ' + $scope.order.preferTimeTime.split(' -- ')[1] + ':00'
        ];

        $.ajax({
                url: 'http://www.lifeuxuan.com/backend/api/FruitOrderInsert.php',
                data: {
                    'longitude': $rootScope.longitude || 121.470257,
                    'latitude': $rootScope.latitude || 31.3234,
                    // 'orderTime': moment,
                    'userId': '1',
                    'userPhoneNumber': $scope.order.receiverPhone + "",
                    'userAddress': $scope.order.receiverAddress + "",
                    'userPreferTime': userPreferTime,
                    'eguardId': $scope.order.guard + "",
                    'isPaid': true,
                    'totalMoney': tempPrice,
                    'note': $scope.order.note || "无" + "",
                    'productList': tempOrderGoodList
                }
            })
            .done(function(e) {
                var data = JSON.parse(e);
                $scope.$apply(function() {
                    if (data.code == 0) {
                        $rootScope.message = 'success';
                    } else {
                        $rootScope.message = 'failed';
                    }
                    $state.go('orderStatus');
                })
            })
            .fail(function(e) {
                console.log(e);
                console.log("error");
                x.innerHTML = e.responseText;
            })
            .always(function() {
                console.log("complete");
            });
        // , function(e) {
        //             $rootScope.message = 'success';
        //             if (e.statusCode == 0) {
        //                 ForwardPay();
        //             }
        //             // $state.go('orderStatus');
        //         }, function() {
        //             $rootScope.message = 'fail';
        //             $state.go('orderStatus');
        //         });


        function ForwardPay() {

            $.ajax({
                    url: 'http://www.lifeuxuan.com/backend/wxpay/pay/WxPayCtrl.php',
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        //'openId': 'oDHyIvznjdxR2KFmyAjWMs2S0lyU',
                        'payMoney': tempPrice * 100 + ''
                    }
                })
                .done(function(e) {
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
                                // alert('success');
                                $rootScope.message = 'success';
                                $state.go('orderStatus');
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
                    });
                },
                cancel: function() {
                    alert("fa");
                }
            });
        });
    }

    function addZero(number) {
        if (number > 10) {
            return number + '';
        } else {
            return '0' + '' + number;
        }
    }

})

.controller('OrderStatusCtrl', function($scope, $stateParams, $ionicHistory, $rootScope) {
    // $scope.status = $rootScope.message;
    if ($rootScope.message == "failed") {
        $scope.status = "下单失败";
    }
    if ($rootScope.message == "success") {
        $scope.status = "下单成功";
    }
})

.controller('AccountCtrl', function($scope, userinfo, $rootScope) {

    $scope.user = $rootScope.user;
    $scope.user = $rootScope.user;
    // $.ajax({
    //         url: 'http://www.lifeuxuan.com/backend/userinfo.php',
    //         type: 'GET',
    //         dataType: 'json',
    //         data: {}
    //     })
    //     .done(function(e) {
    //         // var res = JSON.parse(e);
    //         alert(e.openid);
    //         alert(e.nickname);
    //         // for(var p in e){
    //         //     alert(p);
    //         //     alert(e[p])
    //         // }
    //         $scope.$apply(function() {
    //             $rootScope.openid = e.openid;
    //             $scope.user = { name: e.nickname };
    //             $scope.user = { img: e.headimgurl };
    //         })
    //     })
    //     .fail(function(e) {
    //         alert(e);
    //         alert(e.msg);
    //         alert(JSON.parse(e));
    //     });
    // console.log('go');
})

.controller('OrdersCtrl', function($scope, $rootScope, QueryOrderList) {
        $scope.$on("$ionicView.enter", function(event, data) {
            QueryOrderList.get({
                'longitude': $rootScope.longitude || 121.470257,
                'latitude': $rootScope.latitude || 31.3234,
                'userId': '1'
            }, function(data) {
                $scope.orders = data.data;
            });
        });


        $scope.doRefresh = function() {

            console.log('Refreshing!');
            QueryOrderList.get({
                'longitude': $rootScope.longitude || 121.470257,
                'latitude': $rootScope.latitude || 31.3234,
                'userId': '1'
            }, function(data) {
                $scope.orders = data.data;
            });

            //Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
        }
    })
    // .controller('ListViewCtrl', function($scope, $rootScope, $ionicHistory, $location) {
    //     $scope.myGoBack = function() {
    //         $location.path('/app');
    //     };
    //     $scope.firstActive = function(param) {
    //         $scope.isFirstActive = param;
    //     }
    // })

// .controller('ListGoodsCtrl', function($scope, $rootScope, $stateParams, DataFetch) {
//     var temp = '';
//     // var data = DataFetch.get({
//     //     funcid: 5
//     // }, function(data) {
//     //     $scope.categorys = data.classifys;
//     // });
// })

// .controller('ListGoodsChangeCtrl', function($scope, $rootScope, $stateParams, DataFetch) {
//     // DataFetch.query({
//     //     funcid: '6',
//     //     'classifyId': $stateParams.goodsId 
//     // }, function (data) {
//     //     $scope.fruits = data;
//     // });
// })

// .controller('ListSellersCtrl', function($scope, $rootScope, DataFetch) {
//     // DataFetch.query({
//     //     funcid: '7'
//     // }, function (data) {
//     //     $scope.sellers = data;
//     // });
// })



;
