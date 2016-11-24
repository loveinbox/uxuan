var baseURL = 'http://www.lifeuxuan.com/index.php';

angular.module('starter.services')

.factory('EguardOrderList', function($resource) {
  return {
    new: $resource(baseURL + '/orderlist/eguard/new'),
    process: $resource(baseURL + '/orderlist/eguard/process'),
    finish: $resource(baseURL + '/orderlist/eguard/finish')
  }
})

// 接单
.factory('EguardAction', function($resource) {
  return $resource(baseURL + '/api/EguardAcceptOrderConfirm.php');
})
