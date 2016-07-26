angular.module('starter.services', ['ngResource'])

.factory('DataFetch', function($resource, $http) {
    return $resource('http://www.lifeuxuan.com/backend/index.php');
});
