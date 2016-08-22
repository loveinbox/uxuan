angular.module('starter.directives', ['starter.services'])

.directive('goBack', function() {
    return {
        restrict: 'A',
        // replace: true,
        template: '<div class="back-wrap" ng-click="myGoBack()"> ' + '<i class="ion-arrow-left-c"></i><span>返回</span>' + '</div>',
        controller: function($scope, $location, $ionicHistory) {
            $scope.myGoBack = function() {
                $backView = $ionicHistory.backView();
                $backView.go();
                console.log('back');
            };
        }
    }
})

.directive('sellerList', function() {
    return {
        restrict: 'A',
        // replace: true,
        templateUrl: 'templateDirectives/sellersListDirective.html',
        controller: function($scope, $rootScope, NearByFruitShops, ShoppingCart) {
            NearByFruitShops.get({
                'longitude': $rootScope.longitude || 121.483159,
                'latitude': $rootScope.latitude || 31.3333,
            }, function(data) {
                $scope.sellers = getCartNumber(data.data);
            }, function(data) {
                alert('NO DATA');
            });

            $rootScope.$on('$stateChangeStart', function(event, toState) {
                $scope.sellers = getCartNumber($scope.sellers);
            });

            function getCartNumber(sellerList) {
                $.each(sellerList, function(index, value) {
                    value.cartNumber = ShoppingCart.getSellerCartNumber(value.sellerId);
                })
                return sellerList;
            }
        }
    }
})

.directive('eGuard', function() {
    return {
        restrict: 'A',
        // replace: true,
        template: '<p class="guard">管家{{eGuard.name}}为您服务</p>',
        controller: function($scope, $rootScope, NearByEguard, Location) {
            if ($rootScope.eGuard == undefined) {
                // Location.then(function() {
                NearByEguard.get({
                    'longitude': $rootScope.longitude || 121.483159,
                    'latitude': $rootScope.latitude || 31.3234,
                }, function(data) {
                    $rootScope.eGuard = $scope.eGuard = data.data[0];
                }, function(data) {
                    alert('NO DATA');
                });
                // })
            }
        }
    }
})

.directive('cart', function() {
    return {
        restrict: 'A',
        // replace: true,
        templateUrl: 'templateDirectives/myModal.html',
        controller: function($scope, $rootScope, $ionicModal) {
            $scope.addCart = function(event, good) {
                event.stopPropagation();
                cartNumber = ShoppingCart.add(event, good);
                $scope.isHideAddCart = true;
                $scope.singleNumber = cartNumber;
                $scope.cart.number = ShoppingCart.getSellerCartNumber(good.sellerId);
                $scope.cartGoods = ShoppingCart.getSellerProductList(good.sellerId);
            };

            $scope.removeCart = function(good) {
                event.stopPropagation();
                var cartNumber = ShoppingCart.remove(good);
                if (cartNumber == 0) {
                    $scope.isHideAddCart = false;
                }
                $scope.singleNumber = cartNumber;
                $scope.cart.number = ShoppingCart.getSellerCartNumber(good.sellerId);
                $scope.cartGoods = ShoppingCart.getSellerProductList(good.sellerId);
                if ($scope.cart.number == 0) {
                    $scope.modal.hide();
                }
            };

            $ionicModal.fromTemplateUrl('templateDirectives/myModal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modal = modal;
                $scope.modal.hide();
            });
            $scope.openModal = function() {
                if ($scope.cart.number > 0) {
                    $scope.modal.show();
                    $scope.cartGoods = ShoppingCart.getSellerProductList($scope.session.sellerId);
                }
            };
            $scope.closeModal = function() {
                $scope.modal.hide();
            };
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
//                  'longitude': $rootScope.longitude || 121.470257,
//                  'latitude': $rootScope.latitude || 31.3234,
//              }, function(data) {
//                  $scope.goods = data.data;
//              }, function(data) {
//                  alert('NO DATA');
//              });
//         }
//     }
// })
;
