var baseUrl = 'http://www.lifeuxuan.com/index.php';
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
  'SendCheckCode': '/code/send',
  'CheckCheckCode': '/code/check',
  'Search': '/search/normal',
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
