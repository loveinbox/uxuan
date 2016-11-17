angular.module('starter.services', ['ngResource'])

.factory('NearByEguard', function($resource) {
  return $resource('http://www.lifeuxuan.com/backend/api/NearByEguard.php');
})

.factory('MainPageHot', function($resource) {
  return $resource('http://www.lifeuxuan.com/backend/api/MainPageHot.php');
})

.factory('NearByFruitShops', function($resource) {
  return $resource('http://www.lifeuxuan.com/backend/api/NearByFruitShops.php');
})

.factory('FruitsByShop', function($resource) {
  return $resource('http://www.lifeuxuan.com/backend/api/FruitsByShop.php');
})

.factory('FruitDetail', function($resource) {
  return $resource('http://www.lifeuxuan.com/backend/api/FruitDetail.php');
})

.factory('FruitPicShow', function($resource) {
  return $resource('http://www.lifeuxuan.com/backend/api/FruitPicShow.php');
})

.factory('FruitUxuanRank', function($resource) {
  return $resource('http://www.lifeuxuan.com/backend/api/FruitUxuanRank.php');
})

.factory('FruitOrderInsert', function($resource) {
  return $resource('http://www.lifeuxuan.com/backend/api/FruitOrderInsert.php');
})

.factory('QueryOrderList', function($resource) {
  return $resource('http://www.lifeuxuan.com/backend/api/QueryOrderList.php');
})

.factory('PayConfirm', function($resource) {
  return $resource('http://www.lifeuxuan.com/backend/api/PayConfirm.php');
})

.factory('OrderCancel', function($resource) {
  return $resource('http://www.lifeuxuan.com/backend/api/OrderCancel.php');
})

.factory('QueryOrderDetail', function($rootScope, $resource) {
  return $resource('http://www.lifeuxuan.com/backend/api/QueryOrderDetail.php');
})

.factory('SendCheckCode', function($resource) {
  return $resource('http://www.lifeuxuan.com/backend/api/SendCheckCode.php');
})

.factory('CheckCheckCode', function($resource) {
  return $resource('http://www.lifeuxuan.com/backend/api/CheckCheckCode.php');
})

.factory('Search', function($resource) {
  return $resource('http://www.lifeuxuan.com/backend/api/Search.php');
})

;
