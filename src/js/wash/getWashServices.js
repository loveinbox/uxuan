var baseURL = 'http://www.lifeuxuan.com/index.php';

angular.module('starter.services')

.factory('getWashShops', function($resource, $http) {
  return $resource(baseURL + '/shoplist/wash');
})

.factory('getWashShop', function($resource, $http) {
  return $resource(baseURL + '/shop/wash');
})

.factory('getWashHot', function($resource, $http) {
  return $resource(baseURL + '/hot/shoplist/wash');
})

.factory('getWashRank', function($resource, $http) {
  return $resource(baseURL + '/rank/index/wash');
})

.factory('insertWashReserve', function($resource, $http) {
  return $resource(baseURL + '/order/reserve/wash');
})

.factory('insertWashOrder', function($resource, $http) {
  return $resource(baseURL + '/order/insert/wash');
})

;
