var baseUrl = 'http://www.lifeuxuan.com/index.php';
var serviceURLs = {
  'guardOrderFlow': '/account/eguard/orderflow',
  'shopOrderFlow': '/account/shop/orderflow',
  'resetGuard': '/account/eguard/updatepassword',
  'resetShop': '/account/shop/updatepassword',
  'guardAccount': '/account/eguard/basicinfo',
  'shopAccount': '/account/shop/basicinfo',
  'guardLogin': '/account/eguard/login',
  'shopLogin': '/account/shop/login',
  'guardNotices': '/account/eguard/notify',
  'shopNotices': '/account/shop/notify',
  'guardWork': '/account/eguard/work',
  'guardFree': '/account/eguard/free',
  'guardLogout': '/account/eguard/logout',
  'shopLogout': '/account/shop/logout',
  'guardInfo': '/account/eguard/extendinfo',
  'guardOrderDetailFurit': '/orderdetail/eguard/fruit',
  'guardOrderDetailFetchwash': '/orderdetail/eguard/fetchwash',
  'guardOrderDetailSendwash': '/orderdetail/eguard/sendwash',
  'guardOrderNumber': '/communicate/statistic/eguard',
  'shopOrderNumber': '/communicate/statistic/shop',
  'shopOrderDetailFurit': '/orderdetail/shop/fruit',
  'shopOrderDetailWash': '/orderdetail/shop/wash',
  'shopCashFlow': '/account/shop/withdraw/record',
  'shopCash': '/account/shop/withdraw',
}
ServiceFactory(serviceURLs);

function ServiceFactory(serviceURLs) {
  for (var p in serviceURLs) {
    (function(param) {
      angular.module('starter.services')
        .factory(p, function($resource) {
          return $resource(baseUrl + serviceURLs[param]);
        })
    })(p);
  }
};

// var agreecancelUrl = '/communicate/eguard/fruit/agreecancel';
var refuseUrl = '/communicate/eguard/fruit/refuse';
var acceptUrl = '/communicate/eguard/fruit/accept';
var fetchUrl = '/communicate/eguard/fruit/fetch';
var finishUrl = '/communicate/eguard/fruit/finish';

// var cancelWashUrl = '/communicate/eguardfetch/wash/cancel';
var refuseWashUrl = '/communicate/eguardfetch/wash/refuse';
var acceptWashUrl = '/communicate/eguardfetch/wash/accept';
var fetchWashUrl = '/communicate/eguardfetch/wash/fetch';
var finishWashUrl = '/communicate/eguardfetch/wash/finish';
// var agreecancelWashUrl = '/communicate/eguardfetch/wash/agreecancel';
var refuseSendWashUrl = '/communicate/eguardsend/wash/refuse';
var acceptSendWashUrl = '/communicate/eguardsend/wash/accept';
var fetchSendWashUrl = '/communicate/eguardsend/wash/fetch';
var finishSendWashUrl = '/communicate/eguardsend/wash/finish';

var vendorBeginWashUrl = '/communicate/shop/wash/start';
var vendorFinishWashUrl = '/communicate/shop/wash/finish';

angular.module('starter.services')

.factory('EguardOrderList', function($resource) {
  return {
    new: $resource(baseUrl + '/orderlist/eguard/new'),
    process: $resource(baseUrl + '/orderlist/eguard/process'),
    finish: $resource(baseUrl + '/orderlist/eguard/finish')
  }
})

// 接单
.factory('EguardAction', function($resource) {
  return {
    accept: $resource(baseUrl + acceptUrl),
    fetch: $resource(baseUrl + fetchUrl),
    finish: $resource(baseUrl + finishUrl),
    refuse: $resource(baseUrl + refuseUrl),
    // cancelWash: $resource(baseUrl + cancelWashUrl),
    refuseWash: $resource(baseUrl + refuseWashUrl),
    acceptWash: $resource(baseUrl + acceptWashUrl),
    fetchWash: $resource(baseUrl + fetchWashUrl),
    finishWash: $resource(baseUrl + finishWashUrl),
    // agreecancelWash: $resource(baseUrl + agreecancelWashUrl),
    refuseSendWash: $resource(baseUrl + refuseSendWashUrl),
    acceptSendWash: $resource(baseUrl + acceptSendWashUrl),
    fetchSendWash: $resource(baseUrl + fetchSendWashUrl),
    finishSendWash: $resource(baseUrl + finishSendWashUrl),
  };
})

.factory('VendorOrderList', function($resource) {
  return {
    new: $resource(baseUrl + '/orderlist/shop/new'),
    process: $resource(baseUrl + '/orderlist/shop/process'),
    finish: $resource(baseUrl + '/orderlist/shop/finish')
  }
})

// 接单
.factory('VendorAction', function($resource) {
  return {
    begin: $resource(baseUrl + vendorBeginWashUrl),
    finish: $resource(baseUrl + vendorFinishWashUrl)
  };
})
