var baseURL = 'http://www.lifeuxuan.com/index.php';

angular.module('starter.services')

.factory('VendorOrderList', function($resource) {
  return {
    new: $resource(baseURL + '/orderlist/shop/new'),
    process: $resource(baseURL + '/orderlist/shop/process'),
    finish: $resource(baseURL + '/orderlist/shop/finish')
  }
})

// 接单
.factory('VendorAction', function($resource) {
  return $resource(baseURL + '/api/EguardAcceptOrderConfirm.php');
})
