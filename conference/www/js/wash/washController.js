angular.module('starter.washControllers', []);

angular.module('starter.washControllers')

.controller('washListCtrl', function($scope, UserInfo, MainPageHot, getWashShops, Location) {
	$scope.location = {};
    Location.then(function(e) {
        getWashShops.get({
            'longitude': e.longitude,
            'latitude': e.latitude,
            'sellerId': 2
        }, function(data) {
            $scope.sellers = data.data;
        }, function(data) {
            alert('NO DATA MainPageHot');
        });
    })

})

.controller('washSingleCtrl', function($scope, UserInfo, MainPageHot, getWashShops, Location) {
	$scope.location = {};
    Location.then(function(e) {
        getWashShops.get({
            'longitude': e.longitude,
            'latitude': e.latitude,
            'sellerId': 2
        }, function(data) {
            $scope.sellers = data.data;
        }, function(data) {
            alert('NO DATA MainPageHot');
        });
    })

})

;