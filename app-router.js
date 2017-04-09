angular.module('starter')
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    /*
     *  Base route
     */
      .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: './build/pages/common/menu.html'
    })

    .state('app.index', {
      url: '/index',
      views: {
        'tab-index': {
          templateUrl: './build/pages/common/index.html',
          controller: 'IndexCtrl'
        }
      }
    })

    .state('app.cart', {
      url: '/cart',
      cache: false,
      views: {
        'tab-cart': {
          templateUrl: './build/pages/order/cart.html',
          controller: 'CartCtrl'
        }
      }
    })

    .state('app.order-list', {
      url: '/order-list',
      cache: false,
      views: {
        'tab-order-list': {
          templateUrl: './build/pages/order/order-list.html',
          controller: 'OrderListCtrl'
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


    // /*
    //  *  Shop route
    //  */
    // .state('shop-list', {
    //   url: '/shopList',
    //   cache: false,
    //   templateUrl: 'templates/shopList.html',
    //   controller: 'shopListCtrl'
    // })

    // .state('shop-detail', {
    //   url: '/shop/:shopId',
    //   cache: false,
    //   templateUrl: 'templates/shop.html',
    //   controller: 'shopCtrl'
    // })


    // /*
    //  *  Goods route
    //  */
    // .state('good-list', {
    //   url: '/good-list/:type',
    //   cache: false,
    //   templateUrl: 'templates/good-detail.html',
    //   controller: 'SessionCtrl'
    // })

    // .state('good-detail', {
    //   url: '/good/:type/:sessionId',
    //   cache: false,
    //   templateUrl: 'templates/good-detail.html',
    //   controller: 'SessionCtrl'
    // })


    // .state('orderStatus', {
    //   url: '/orderStatus',
    //   cache: false,
    //   templateUrl: 'templates/orderStatus.html',
    //   controller: 'OrderStatusCtrl'
    // })

    // .state('search', {
    //   url: '/search',
    //   cache: false,
    //   templateUrl: 'templates/search.html',
    //   controller: 'SearchCtrl'
    // })

    // .state('orderDetail', {
    //   url: '/orderDetail/:orderId/:orderType',
    //   cache: false,
    //   templateUrl: 'templates/orderDetail.html ',
    //   controller: 'orderDetailCtrl'
    // })

    // .state('phoneNumberCheck', {
    //   url: '/phoneNumberCheck',
    //   templateUrl: 'templates/phoneNumberCheck.html ',
    //   controller: 'phoneNumberCheckCtrl'
    // })

    // .state('location', {
    //   url: '/location',
    //   template: "<div></div>",
    //   controller: function() {
    //     window.location.replace('/location.html');
    //   }
    // })

    // .state('washList', {
    //   url: '/washList',
    //   cache: false,
    //   templateUrl: 'templates/washTemplates/washList.html ',
    //   controller: 'washListCtrl'
    // })

    // .state('washSingle', {
    //   url: '/washSingle/:shopId',
    //   cache: false,
    //   templateUrl: 'templates/washTemplates/washSingle.html ',
    //   controller: 'washSingleCtrl'
    // })

    // .state('washCart', {
    //   url: '/washCart/:shopId',
    //   cache: false,
    //   templateUrl: 'templates/washTemplates/washCart.html '
    // })

    // .state('washSingleOrder', {
    //   url: '/washSingleOrder/:shopId/:orderId',
    //   cache: false,
    //   templateUrl: 'templates/washTemplates/washSingle-order.html ',
    //   controller: 'washSingleOrderCtrl'
    // })

    // .state('pay', {
    //   url: '/pay',
    //   cache: false,
    //   templateUrl: 'templates/wxPay.html ',
    //   controller: 'wxPayCtrl'
    // })

    ;
    $urlRouterProvider.otherwise('/app/index');
  });
