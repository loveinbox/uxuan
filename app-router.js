angular.module('starter')
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    /*
     *  Base route
     */
      .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: './build/pages/menu/menu.html'
    })

    .state('app.index', {
      url: '/index',
      views: {
        'tab-index': {
          templateUrl: './build/pages/menu/index.html',
          controller: 'IndexCtrl'
        }
      }
    })

    .state('app.cart', {
      url: '/cart/:type',
      cache: false,
      views: {
        'tab-cart': {
          templateUrl: './build/pages/cart/cart.html',
          controller: 'CartCtrl'
        }
      }
    })

    .state('app.order-list', {
      url: '/order',
      views: {
        'tab-order-list': {
          templateUrl: './build/pages/order/order-list.html',
          controller: 'OrderListCtrl'
        }
      }
    })

    .state('app.account', {
      url: '/account',
      views: {
        'tab-account': {
          templateUrl: './build/pages/account/account.html',
          controller: 'AccountCtrl'
        }
      }
    })

    /*
     *  Shop route
     */
    .state('shop-list', {
      url: '/shop/:type',
      templateUrl: './build/pages/shop/shop-list.html',
      controller: 'ShopListCtrl'
    })

    .state('shop-detail', {
      url: '/shop/:type/:shopId',
      templateUrl: './build/pages/shop/shop-detail.html',
      controller: 'ShopDetailCtrl'
    })


    /*
     *  Goods route
     */
    .state('good-detail', {
      url: '/good/:type/:goodId',
      templateUrl: './build/pages/good/good-detail.html',
      controller: 'GoodDetailCtrl'
    })


    // .state('orderStatus', {
    //   url: '/orderStatus',
    //   templateUrl: 'templates/orderStatus.html',
    //   controller: 'OrderStatusCtrl'
    // })

    .state('orderDetail', {
      url: '/order/:type/:orderId',
      templateUrl: './build/pages/order/order-detail.html',
      controller: 'orderDetailCtrl'
    })

    .state('phoneCheck', {
      url: '/phoneCheck',
      templateUrl: './build/pages/phoneCheck/phoneCheck.html',
      controller: 'phoneNumberCheckCtrl'
    })

    // .state('washList', {
    //   url: '/washList',
    //   templateUrl: 'templates/washTemplates/washList.html',
    //   controller: 'washListCtrl'
    // })

    // .state('washSingle', {
    //   url: '/washSingle/:shopId',
    //   templateUrl: 'templates/washTemplates/washSingle.html',
    //   controller: 'washSingleCtrl'
    // })

    // .state('washCart', {
    //   url: '/washCart/:shopId',
    //   templateUrl: 'templates/washTemplates/washCart.html '
    // })

    // .state('washSingleOrder', {
    //   url: '/washSingleOrder/:shopId/:orderId',
    //   templateUrl: 'templates/washTemplates/washSingle-order.html',
    //   controller: 'washSingleOrderCtrl'
    // })

    .state('address', {
      url: '/address/:type',
      templateUrl: './build/pages/address/address.html',
      controller: 'AddressCtrl'
    })

    .state('search', {
      url: '/search',
      templateUrl: './build/pages/search/search.html',
      controller: 'SearchCtrl'
    })

    .state('pay', {
      url: '/pay',
      templateUrl: './build/pages/pay/pay.html',
      controller: 'wxPayCtrl',
      params: {
        orderType: null,
        orderIdsList: null,
        money: null,
      }
    })

    .state('location', {
      url: '/location',
      template: "<div></div>",
      controller: function() {
        window.location.replace('/location.html');
      }
    })

    ;
    $urlRouterProvider.otherwise('/app/index');
  });
