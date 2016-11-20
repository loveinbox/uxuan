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

;
