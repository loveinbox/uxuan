angular.module('starter.controllers', ['starter.services'])
    .run(function run($rootScope) {
        $rootScope.requestUrl = 'http://www.lifeuxuan.com/backend/index.php';
    })

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $rootScope) {
    $rootScope.goods = new Map;
    $rootScope.totalPrice = 0;
})

.controller('SessionsCtrl', function($scope, DataFetch, $rootScope) {
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


    DataFetch.query({
        'funcid': 1,
        'longitude': 131424,
        'latitude': 34
    }, function(data) {
        $scope.sessions = data;
    }, function(data) {
        alert('NO DATA');
    });

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

.controller('SessionCtrl', function($rootScope, $scope, $stateParams, DataFetch, $ionicHistory, $ionicModal) {
    $rootScope.goods = $rootScope.goods || new Map;
    $scope.isHideAddCart = false;
    $scope.singleNumber = 0;
    $scope.allNumber = $rootScope.goods.size;
    $rootScope.totalPrice = $rootScope.totalPrice || 0;

    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    };
    console.log($stateParams);

    DataFetch.get({
        'funcid': 2,
        'goodId': $stateParams.sessionId
    }, function (data) {
         $scope.session = data;
    })

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
        if ($rootScope.goods.has($scope.session.goodId)) {
            $rootScope.goods.get($scope.session.goodId).buyNumber++;
        } else {
            $scope.session.buyNumber = 1;
            $rootScope.goods.set($scope.session.goodId, $scope.session);
        }
        $scope.allNumber++;
        // $scope.allNumber = $rootScope.goods.size;
        $scope.singleNumber++;
        $scope.isHideAddCart = true;
        var tempPrice = 0;
        $rootScope.goods.forEach(function(value, key) {
            tempPrice += value.goodPrice * value.buyNumber;
        })
        $rootScope.totalPrice = tempPrice;
    };

    $scope.removeCart = function(event) {
        // var buyNumber = $rootScope.goods.get($scope.session.goodId).buyNumber;
        if ($scope.singleNumber <= 0) {
            return;
        }
        var num = $rootScope.goods.get($scope.session.goodId).buyNumber--;
        // $scope.allNumber--;
        if (num === 0) {
            $rootScope.goods.delete($scope.session.goodId);
        }

        $scope.allNumber--;
        // $scope.allNumber = $rootScope.goods.size;
        $scope.singleNumber--;
        // $scope.isHideAddCart = true;
        var tempPrice = 0;
        $rootScope.goods.forEach(function(value, key) {
            tempPrice += value.goodPrice * value.buyNumber;
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

.controller('OrderCtrl', function($scope, $stateParams, DataFetch, $ionicHistory, $rootScope, $location, $state) {
    $rootScope.goods = $rootScope.goods || new Map;
    $rootScope.totalPrice = $rootScope.totalPrice || 0;
    $scope.order = {};
    $scope.order.guard = 1;

    $scope.myGoBack = function() {
        $ionicHistory.goBack();
    };
    var date = new Date;
    $scope.temp = {
        today: date.getMonth() + 1 + '月' + date.getDate() + '日',
        tomorrow: date.getMonth() + 1 + '月' + (date.getDate() + 1) + '日'
    };
    var tempGoods = [];
    var tempPrice = 0;
    var tempOrderGoodList = [];
    $rootScope.goods.forEach(function(value, key) {
        tempPrice += value.goodPrice * value.buyNumber;
        tempGoods.push(value);
        tempOrderGoodList.push({
            'goodId': value.goodId,
            'goodPrice': value.goodPrice,
            'goodQuantity': value.buyNumber
        })
    })
    $scope.goods = tempGoods;
    $rootScope.totalPrice = tempPrice;

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
                alert(e);
                wx.config({
                    debug: false,
                    appId: e.appId,
                    timestamp: e.timestamp,
                    nonceStr: e.nonceStr,
                    signature: e.signature,
                    jsApiList: ['checkJsApi', 'openAddress']
                });
                wx.error(function(res) {});
            })
            .fail(function(e) {
                // alert(e);
            })
            .always(function() {});

    })();

    $scope.confirmOrder = function() {

        // register();
        var date = new Date();
        var moment = addZero(date.getFullYear()) + '-' + addZero(date.getMonth()) + '-' + addZero(date.getDate()) + ' ' + addZero(date.getHours()) + ':' + addZero(date.getMinutes()) + ':' + addZero(date.getSeconds());

        DataFetch.get({
            'funcid': 4,
            'orderTime': moment,
            'userId': '123123',
            'userPhoneNumber': $scope.order.receiverPhone + "",
            'userAddress': $scope.order.receiverAddress + "",
            'userPreferTime': ['2016-07-04 19:00:00', '2016-07-04 20:00:00'],
            'eguardId': $scope.order.guard + "",
            'isPaid': true,
            'Note': $scope.order.note || "无" + "",
            'goodList': tempOrderGoodList
                // [{
                //     'goodId': '12312',
                //     'goodPrice': '12.5',
                //     'goodQuantity': '12'
                // }, {
                //     'goodId': '12312',
                //     'goodPrice': '12.5',
                //     'goodQuantity': '12'
                // }]
        },function () {
            $rootScope.message = 'success';
            $state.go('orderStatus');
            ForwardPay();
        },function () {
            $rootScope.message = 'fail';
            $state.go('orderStatus');
            ForwardPay();
        })

        // $.ajax({
        //         url: $rootScope.requestUrl,
        //         type: 'GET',
        //         dataType: 'json',
        //         data: {
        //             'funcid': 4,
        //             'orderTime': moment,
        //             'userId': '123123',
        //             'userPhoneNumber': $scope.order.receiverPhone + "",
        //             'userAddress': $scope.order.receiverAddress + "",
        //             'userPreferTime': ['2016-07-04 19:00:00', '2016-07-04 20:00:00'],
        //             'eguardId': $scope.order.guard + "",
        //             'isPaid': true,
        //             'Note': $scope.order.note || "无" + "",
        //             'goodList': tempOrderGoodList
        //                 // [{
        //                 //     'goodId': '12312',
        //                 //     'goodPrice': '12.5',
        //                 //     'goodQuantity': '12'
        //                 // }, {
        //                 //     'goodId': '12312',
        //                 //     'goodPrice': '12.5',
        //                 //     'goodQuantity': '12'
        //                 // }]
        //         }
        //     })
        //     .done(function(e) {
        //         console.log('success');
        //         $rootScope.message = 'success';
        //         // $state.go('orderStatus');
        //         ForwardPay();
        //     })
        //     .fail(function(e) {
        //         $scope.$apply(function() {
        //             $rootScope.message = e.ret;
        //             $location.path('/orderStatus');
        //         });
        //     })
        //     .always(function(e) {
        //         // $scope.$apply(function() {
        //         //     $rootScope.message = JSON.parse(e).ret;
        //         //     $location.path('/orderStatus');
        //         // }); 
        //     });

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
                    alert(e);
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

.controller('OrderStatusCtrl', function($scope, $stateParams, DataFetch, $ionicHistory, $rootScope) {
    // $scope.status = $rootScope.message;
    if ($rootScope.message == "failed") {
        $scope.status = "下单失败";
    }
    if ($rootScope.message == "success") {
        $scope.status = "下单成功";
    }
})

.controller('AccountCtrl', function($scope) {
    $.ajax({
            url: 'http://www.lifeuxuan.com/backend/userinfo.php',
            type: 'GET',
            dataType: 'json',
            data: {}
        })
        .done(function(e) {
            alert(e);
            // var res = JSON.parse(e);
            $scope.userName = e.nickname;
            $scope.userImg = e.headimgurl;

        })
        .fail(function(e) {
            //alert(e);
        });
    console.log('go');
})

.controller('ListViewCtrl', function($scope, $rootScope, $ionicHistory, $location) {
    $scope.myGoBack = function() {
        $location.path('/app');
    };
    $scope.firstActive = function(param) {
        $scope.isFirstActive = param;
    }
})

.controller('ListGoodsCtrl', function($scope, $rootScope, $stateParams, DataFetch) {
    var temp = '';
    var data = DataFetch.get({
        funcid: 5
    }, function(data) {
        $scope.categorys = data.classifys;
    });
})

.controller('ListGoodsChangeCtrl', function($scope, $rootScope, $stateParams, DataFetch) {
    DataFetch.query({
        funcid: '6',
        'classifyId': $stateParams.goodsId 
    }, function (data) {
        $scope.fruits = data;
    });
})

.controller('ListSellersCtrl', function($scope, $rootScope, DataFetch) {
    DataFetch.query({
        funcid: '7'
    }, function (data) {
        $scope.sellers = data;
    });
})
.controller('OrdersCtrl', function($scope, $rootScope, DataFetch) {
    DataFetch.query({
        'funcid': 8,
        'userId': '123123'
    }, function (data) {
        $scope.orders = data;
    });
})
;
