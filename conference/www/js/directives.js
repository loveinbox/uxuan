angular.module('starter.directives', ['starter.services'])

.directive('goBack', function() {
    return {
        restrict: 'A',
        // replace: true,
        template: '<div class="back-wrap" ng-click="myGoBack()"> ' + '<i class="ion-arrow-left-c"></i><span>返回</span>' + '</div>',
        controller: function($scope, $location, $ionicHistory) {
            $scope.myGoBack = function() {
                $ionicHistory.goBack();
            };
        }
    }
})

.directive('sellerList', function() {
    return {
        restrict: 'A',
        // replace: true,
        templateUrl: 'templateDirectives/sellersListDirective.html',
        controller: function($scope, $rootScope, NearByFruitShops) {
                NearByFruitShops.get({
			        'longitude': $rootScope.longitude || 121.483159,
			        'latitude': $rootScope.latitude || 31.2135,
			    }, function(data) {
			        $scope.sellers = data.data;
			    }, function(data) {
			        alert('NO DATA');
			    });
        }
    }
})

// .directive('goodsList', function() {
//     return {
//         restrict: 'A',
//         replace: true,
//         templateUrl: 'templateDirectives/goodsListDirective.html',
//         controller: function($scope, $rootScope, FruitsByShop) {
//                 FruitsByShop.get({
// 			        'longitude': $rootScope.longitude || 121.470257,
// 			        'latitude': $rootScope.latitude || 31.3234,
// 			    }, function(data) {
// 			        $scope.goods = data.data;
// 			    }, function(data) {
// 			        alert('NO DATA');
// 			    });
//         }
//     }
// })
;
