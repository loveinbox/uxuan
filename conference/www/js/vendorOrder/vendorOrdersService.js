angular.module('starter.services')

.factory('verndorList', function($resource) {
  return $resource('http://www.lifeuxuan.com/backend/api/shopNewOrderList.php');
})

// // 接单
// .factory('acceptOrderService', function($resource) {
//     return $resource('http://www.lifeuxuan.com/backend/api/EguardAcceptOrderConfirm.php');
// })

// // 拒单
// .factory('rejectOrderService', function($resource) {
//     return $resource('http://www.lifeuxuan.com/backend/api/EguardRefuseOrderConfirm.php');
// })

// // 取衣
// .factory('fetchClothesService', function($resource) {
//     return $resource('http://www.lifeuxuan.com/backend/api/EguardFetchClothesConfirm.php');
// })
