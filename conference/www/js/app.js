// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.directives'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $ionicConfigProvider.tabs.position('bottom');
    $stateProvider

        .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('app.index', {
        url: '/sessions',
        cache: false,
        views: {
            'tab-index': {
                templateUrl: 'templates/sessions.html',
                controller: 'SessionsCtrl'
            }
        }
    })

    .state('app.account', {
        url: '/account',
        cache: false,
        views: {
            'tab-account': {
                templateUrl: 'templates/account.html',
                controller: 'AccountCtrl'
            }
        }
    })

    .state('app.orders', {
        url: '/orders',
        cache: false,
        views: {
            'tab-orders': {
                templateUrl: 'templates/orders.html',
                controller: 'OrdersCtrl'
            }
        }
    })

    .state('app.cart', {
        url: '/cart',
        cache: false,
        views: {
            'tab-cart': {
                templateUrl: 'templates/order.html',
                controller: 'OrderCtrl'
            }
        }
    })

    .state('seller-list', {
        url: '/sellerList/:sellerId',
        cache: false,
        templateUrl: 'templates/sellerList.html',
        controller: 'sellerListCtrl'
    })

    .state('seller', {
        url: '/seller/:sellerId',
        cache: false,
        templateUrl: 'templates/seller.html',
        controller: 'sellerCtrl'
    })

    .state('orderStatus', {
        url: '/orderStatus',
        cache: false,
        templateUrl: 'templates/orderStatus.html',
        controller: 'OrderStatusCtrl'
    })

    .state('session', {
        url: '/sessions/:sessionId',
        cache: false,
        templateUrl: 'templates/session.html',
        controller: 'SessionCtrl'
    })

    .state('search', {
        url: '/search',
        templateUrl: 'templates/search.html',
        controller: 'SearchCtrl'
    })

    .state('orderDetail', {
        url: '/orderDetail/:orderId',
        cache: false,
        templateUrl: 'templates/orderDetail.html ',
        controller: 'orderDetailCtrl'
    })

    .state('phoneNumberCheck', {
        url: '/phoneNumberCheck',
        cache: false,
        templateUrl: 'templates/phoneNumberCheck.html ',
        controller: 'phoneNumberCheckCtrl'
    })

    ;
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/sessions');
});

(function() {
    var HorizontalScrollFix = (function() {
        function HorizontalScrollFix($timeout, $ionicScrollDelegate) {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    var mainScrollID = attrs.horizontalScrollFix,
                        scrollID = attrs.delegateHandle;

                    var getEventTouches = function(e) {
                        return e.touches && (e.touches.length ? e.touches : [{
                            pageX: e.pageX,
                            pageY: e.pageY
                        }]);
                    };

                    var fixHorizontalAndVerticalScroll = function() {
                        var mainScroll, scroll;
                        mainScroll = $ionicScrollDelegate.$getByHandle(mainScrollID).getScrollView();
                        scroll = $ionicScrollDelegate.$getByHandle(scrollID).getScrollView();

                        // patch touchstart
                        scroll.__container.removeEventListener('touchstart', scroll.touchStart);
                        scroll.touchStart = function(e) {
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
                            $timeout((function() {
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
                            }), 100);
                        };
                        scroll.__container.addEventListener('touchstart', scroll.touchStart);
                    };
                    $timeout(function() { fixHorizontalAndVerticalScroll(); });
                }
            };
        }

        return HorizontalScrollFix;

    })();

    angular.module('starter').directive('horizontalScrollFix', ['$timeout', '$ionicScrollDelegate', HorizontalScrollFix]);

}).call(this);
