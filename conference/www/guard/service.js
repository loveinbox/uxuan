var baseUrl = 'http://www.lifeuxuan.com/index.php';
var serviceURLs = {
  guardOrderFlow: '/account/eguard/orderflow',
  resetGuard: '/account/eguard/updatepassword',
  resetShop: '/account/shop/updatepassword',
  guardAccount: '/account/eguard/basicinfo',
  shopAccount: '/account/shop/basicinfo',
  guardLogin: '/account/eguard/login',
  shopLogin: '/account/shop/login',
  guardNotices: '/account/eguard/notify',
  shopNotices: '/account/shop/notify',
  guardWork: '/account/eguard/work',
  guardFree: '/account/eguard/free',
  guardLogout: '/account/eguard/logout',
  shopLogout: '/account/shop/logout',
  guardInfo: '/account/eguard/extendinfo'
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

var agreecancelUrl = '/communicate/eguard/fruit/agreecancel';
var refuseUrl = '/communicate/eguard/fruit/refuse';
var acceptUrl = '/communicate/eguard/fruit/accept';
var fetchUrl = '/communicate/eguard/fruit/fetch';
var finishUrl = '/communicate/eguard/fruit/finish';

var cancelWashUrl = '/communicate/eguardfetch/wash/cancel';
var refuseWashUrl = '/communicate/eguardfetch/wash/refuse';
var acceptWashUrl = '/communicate/eguardfetch/wash/accept';
var fetchWashUrl = '/communicate/eguardfetch/wash/fetch';
var finishWashUrl = '/communicate/eguardfetch/wash/finish';
// var agreecancelWashUrl = '/communicate/eguardfetch/wash/agreecancel';
var refuseSendWashUrl = '/communicate/eguardsend/wash/refuse';
var acceptSendWashUrl = '/communicate/eguardsend/wash/accept';
var fetchSendWashUrl = '/communicate/eguardsend/wash/fetch';
var finishSendWashUrl = '/communicate/eguardsend/wash/finish';

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
    cancelWash: $resource(baseUrl + cancelWashUrl),
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
