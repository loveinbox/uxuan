angular.module('starter.services')

.factory('EguardNewOrderList', function($resource) {
    return $resource('http://www.lifeuxuan.com/backend/api/EguardNewOrderList.php');
})