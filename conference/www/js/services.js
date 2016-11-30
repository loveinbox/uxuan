angular.module('starter.services', ['ngResource']);
var baseURL = 'http://www.lifeuxuan.com/index.php';
var serviceURLs = {
  'NearByEguard': '/eguards',
  'MainPageHot': '/hot/index',
  'NearByFruitShops': '/shoplist/fruit',
  'FruitsByShop': '/shop/fruit',
  'FruitDetail': '/product/fruit',
  'FruitPicShow': '/productshow/fruit',
  'FruitUxuanRank': '/rank/index/fruit',
  'FruitOrderInsert': '/order/insert/fruit',
  'OrderList': '/orderlist/customer',
  'FuritOrderDetail': '/orderdetail/customer/fruit',
  'WashOrderDetail': '/orderdetail/customer/wash',
  'SendCheckCode': '/SendCheckCode.php',
  'CheckCheckCode': '/CheckCheckCode.php',
  'Search': '/Search.php',
  'WxPay': '/wxctrl/pay',
  'WxPayConfirmFurit': '/payconfirm/fruit',
  'WxPayConfirmWash': '/payconfirm/wash',
  'StartPrice': '/communicate/customer/wash/startprice',
  'BannerIndex': '/banner/index',
  'BannerFurit': '/banner/shoplist/fruit',
  'BannerWash': '/banner/shoplist/wash',
  'cancelFurit': '/communicate/customer/fruit/cancel',
  'cancelWash': '/communicate/customer/wash/cancel',
};
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

angular.module('starter.services')
  .service('WxPayParam', function($resource) {
    var param = {
      money: 0
    };
    this.set = function(input) {
      param = input;
    }
    this.get = function() {
      return param;
    }
  })

.service('FuritOrWash', function($resource) {
  var furitOrWash = 'furit';
  var washShopId = '000';
  var washOrderId = '000';
  var isReserve = false;
  this.toFurit = function() {
    furitOrWash = 'furit';
  }
  this.toWash = function(shopId, orderId, reserve) {
    furitOrWash = 'wash';
    washShopId = shopId;
    washOrderId = orderId;
    isReserve = reserve;
  }
  this.get = function() {
    return furitOrWash;
  }
  this.getParams = function() {
    return {
      washShopId: washShopId,
      washOrderId: washOrderId,
      isReserve: isReserve
    }
  }
})

;
