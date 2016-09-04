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
        controller: function($scope, $rootScope, NearByFruitShops, ShoppingCart, UserInfo, Location) {
            Location.then(function () {
                console.log('get location goods', UserInfo.user.longitude, UserInfo.user.latitude);                
                NearByFruitShops.get({
                    'longitude': UserInfo.user.longitude,
                    'latitude': UserInfo.user.latitude,
                }, function(data) {
                    $scope.sellers = getCartNumber(data.data);
                }, function(data) {
                    alert('NO DATA NearByFruitShops');
                });
            })

            $rootScope.$on('$stateChangeStart', function(event, toState) {
                $scope.sellers = getCartNumber($scope.sellers);
            });

            $scope.$on('cartChange', function() {
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
        controller: function($scope, $rootScope, NearByEguard, Location, UserInfo) {
            if ($rootScope.eGuard == undefined) {
                Location.then(function() {
                    NearByEguard.get({
                        'longitude': UserInfo.user.longitude,
                        'latitude': UserInfo.user.latitude,
                    }, function(data) {
                        $rootScope.eGuard = $scope.eGuard = data.data[0];
                    }, function(data) {
                        alert('NO DATA');
                    });
                })
            }
        }
    }
})

.directive('cart', function() {
    return {
        restrict: 'A',
        // replace: true,
        templateUrl: 'templateDirectives/myModal.html',
        controller: function($scope, $rootScope, $ionicModal, ShoppingCart) {
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

.directive('singleCart', function() {
    return {
        restrict: 'A',
        // replace: true,
        templateUrl: 'templateDirectives/singleCart.html',
        controller: function($scope, $rootScope, $ionicModal, $state, ShoppingCart, UserInfo) {

            cartNumber = ShoppingCart.get($scope.good);
            $scope.singleNumber = cartNumber;
            if ($scope.singleNumber > 0) {
                $scope.isHideAddCart = true;
            }
            $scope.addCart = function(event, good) {
                event.stopPropagation();
                event.preventDefault();
                if (!UserInfo.user.phoneNumber) {
                    $state.go('phoneNumberCheck');
                    return;
                }
                cartNumber = ShoppingCart.add(event, good);
                $scope.isHideAddCart = true;
                $scope.singleNumber = cartNumber;
                $rootScope.$broadcast('cartChange');
            };

            $scope.removeCart = function(good) {
                event.stopPropagation();
                event.preventDefault();
                var cartNumber = ShoppingCart.remove(good);
                if (cartNumber == 0) {
                    $scope.isHideAddCart = false;
                }
                $scope.singleNumber = cartNumber;
                $rootScope.$broadcast('cartChange');
            };
        }
    }
})

;
