var baseURL = 'http://www.lifeuxuan.com/index.php';

angular.module('starter.services', ['ngResource'])

.factory('NearByEguard', function($resource) {
  return $resource(baseURL + '/eguards');
})

.factory('MainPageHot', function($resource) {
  return $resource(baseURL + '/hot/index');
})

.factory('NearByFruitShops', function($resource) {
  return $resource(baseURL + '/shoplist/fruit');
})

.factory('FruitsByShop', function($resource) {
  return $resource(baseURL + '/shop/fruit');
})

.factory('FruitDetail', function($resource) {
  return $resource(baseURL + '/product/fruit');
})

.factory('FruitPicShow', function($resource) {
  return $resource(baseURL + '/productshow/fruit');
})

.factory('FruitUxuanRank', function($resource) {
  return $resource(baseURL + '/rank/index/fruit');
})

.factory('FruitOrderInsert', function($resource) {
  return $resource(baseURL + '/order/insert/fruit');
})

.factory('QueryOrderList', function($resource) {
  return $resource(baseURL + '/orderlist/customer');
})

.factory('PayConfirm', function($resource) {
  return $resource(baseURL + '/PayConfirm.php');
})

.factory('OrderCancel', function($resource) {
  return $resource(baseURL + '/OrderCancel.php');
})

.factory('QueryOrderDetail', function($rootScope, $resource) {
  return $resource(baseURL + '/QueryOrderDetail.php');
})

.factory('SendCheckCode', function($resource) {
  return $resource(baseURL + '/SendCheckCode.php');
})

.factory('CheckCheckCode', function($resource) {
  return $resource(baseURL + '/CheckCheckCode.php');
})

.factory('Search', function($resource) {
  return $resource(baseURL + '/Search.php');
})

.factory('WxPay', function($resource) {
  return $resource(baseURL + '/wxctrl/pay');
})

.factory('WxPayConfirm', function($resource) {
  return $resource(baseURL + '/payconfirm/fruit');
})

;
