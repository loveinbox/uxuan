angular.module('starter.services', ['ngResource'])

.factory('NearByEguard', function($resource, $http) {
    return $resource('http://www.lifeuxuan.com/backend/api/NearByEguard.php');
})

.factory('MainPageHot', function($resource, $http) {
    return $resource('http://www.lifeuxuan.com/backend/api/MainPageHot.php');
})

.factory('NearByFruitShops', function($resource, $http) {
    return $resource('http://www.lifeuxuan.com/backend/api/NearByFruitShops.php');
})

.factory('FruitsByShop', function($resource, $http) {
    return $resource('http://www.lifeuxuan.com/backend/api/FruitsByShop.php');
})

.factory('FruitDetail', function($resource, $http) {
    return $resource('http://www.lifeuxuan.com/backend/api/FruitDetail.php');
})

.factory('FruitPicShow', function($resource, $http) {
    return $resource('http://www.lifeuxuan.com/backend/api/FruitPicShow.php');
})

.factory('FruitUxuanRank', function($resource, $http) {
    return $resource('http://www.lifeuxuan.com/backend/api/FruitUxuanRank.php');
})

.factory('FruitOrderInsert', function($resource, $http) {
    return $resource('http://www.lifeuxuan.com/backend/api/FruitOrderInsert.php');
})

.factory('QueryOrderList', function($resource, $http) {
    return $resource('http://www.lifeuxuan.com/backend/api/QueryOrderList.php');
})

.factory('userinfo', function($resource, $http) {
    return $resource('http://www.lifeuxuan.com/backend/api/userinfo.php');
})

;
