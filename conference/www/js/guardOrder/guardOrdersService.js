angular.module('starter.services')

.factory('EguardNewOrderList', function($resource) {
    return $resource('http://www.lifeuxuan.com/backend/api/EguardNewOrderList.php');
})

// 接单
.factory('acceptOrderService', function($resource) {
    return $resource('http://www.lifeuxuan.com/backend/api/EguardAcceptOrderConfirm.php');
})

// 拒单
.factory('rejectOrderService', function($resource) {
    return $resource('http://www.lifeuxuan.com/backend/api/EguardRefuseOrderConfirm.php');
})

// 取衣
.factory('fetchClothesService', function($resource) {
    return $resource('http://www.lifeuxuan.com/backend/api/EguardArriveCustomer.php');
})

// 送衣服
.factory('sendClothesService', function($resource) {
    return $resource('http://www.lifeuxuan.com/backend/api/EguardForwardShop.php.php');
})




