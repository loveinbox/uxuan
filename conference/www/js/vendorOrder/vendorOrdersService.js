var baseURL = 'http://www.lifeuxuan.com/index.php';
// var 20.商家端 '洗衣 开始清洗 communicate/shop/wash/start';
// var 21.商家端 '洗衣 清洗完成 communicate/shop/wash/finish';
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
