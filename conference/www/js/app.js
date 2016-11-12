// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.directives','starter.services'])

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
    views: {
      'tab-index': {
        templateUrl: 'templates/sessions.html',
        controller: 'SessionsCtrl'
      }
    }
  })

  .state('app.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/account.html',
        controller: 'AccountCtrl'
      }
    }
  })

  .state('app.orders', {
    url: '/orders',
    views: {
      'tab-orders': {
        templateUrl: 'templates/orders.html',
        controller: 'OrdersCtrl'
      }
    }
  })

  .state('app.cart', {
    url: '/cart',
    views: {
      'tab-cart': {
        templateUrl: 'templates/order.html',
        controller: 'OrderCtrl'
      }
    }
  })

  .state('seller-list', {
    url: '/sellerList',
    templateUrl: 'templates/sellerList.html',
    controller: 'sellerListCtrl'
  })

  .state('seller', {
    url: '/seller/:sellerId',
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
    templateUrl: 'templates/orderDetail.html ',
    controller: 'orderDetailCtrl'
  })

  .state('phoneNumberCheck', {
    url: '/phoneNumberCheck',
    templateUrl: 'templates/phoneNumberCheck.html ',
    controller: 'phoneNumberCheckCtrl'
  })

  .state('location', {
    url: '/location',
    template: "<div></div>",
    controller: function() {
      window.location.replace('/location.html');
    }
  })

  ;
});

angular.module('starter')
  .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $stateProvider
      .state('washList', {
        url: '/washList',
        cache: false,
        templateUrl: 'templates/washTemplates/washList.html ',
        controller: 'washListCtrl'
      })

    .state('washSingle', {
      url: '/washSingle/:washId',
      cache: false,
      templateUrl: 'templates/washTemplates/washSingle.html ',
      controller: 'washSingleCtrl'
    })

    .state('washCart', {
      url: '/washCart/:shopId',
      cache: false,
      templateUrl: 'templates/washTemplates/washCart.html ',
      controller: 'washCartController'
    })

    .state('washSingleOrder', {
      url: '/washSingleOrder/:washId',
      cache: false,
      templateUrl: 'templates/washTemplates/washSingle-order.html ',
      controller: 'washSingleOrderCtrl'
    })

    .state('washCartOrder', {
      url: '/washCartOrder/:shopId',
      cache: false,
      templateUrl: 'templates/washTemplates/washCart-order.html ',
      controller: 'washCartOrderController'
    })

    .state('guard', {
      url: '/guard',
      templateUrl: 'templates/backTemplates/guardOrdersTemplate.html ',
      controller: 'guardOrdersController'
    })

    .state('vendor', {
      url: '/vendor',
      templateUrl: 'templates/backTemplates/vendorOrdersTemplate.html ',
      controller: 'vendorOrdersController'
    })

    ;
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/sessions');
  });
