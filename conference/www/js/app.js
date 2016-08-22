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

.config(function($stateProvider, $urlRouterProvider) {
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
            url: '/cart/:from',
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
        templateUrl: 'templates/orderStatus.html',
        controller: 'OrderStatusCtrl'
    })

    .state('session', {
        url: '/sessions/:sessionId',
        cache: false,
        // views: {
        // 'tab-index': {
        templateUrl: 'templates/session.html',
        controller: 'SessionCtrl'
            // }
            // }
    })

    .state('search', {
            url: '/search',
            // views: {
            //   'tab-index': {
            templateUrl: 'templates/search.html'
                // }
                // }
        })
        .state('listView', {
            url: '/listView',
            // views: {
            //   'tab-index': {
            templateUrl: 'templates/listView.html'
                // }
                // }
        });

    //     .state('session', {
    //       url: "/sessions/:sessionId",
    //       templateUrl: "templates/session.html",
    //       controller: 'SessionCtrl'
    // });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/sessions');
});
