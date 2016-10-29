angular.module('starter.directives',[])

.directive('goBack', function() {
    return {
        restrict: 'A',
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
        templateUrl: 'templateDirectives/sellersListDirective.html',
        controller: function($scope, $rootScope, NearByFruitShops, ShoppingCart, UserInfo, Location) {
            UserInfo.then(function(user) {
                console.log('get location goods', user.longitude, user.latitude);
                NearByFruitShops.get({
                    'longitude': user.longitude,
                    'latitude': user.latitude,
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
        template: '<p class="guard">管家{{eGuard.name}}为您服务</p>',
        controller: function($scope, $rootScope, NearByEguard, Location, UserInfo) {
            UserInfo.then(function(user) {
                NearByEguard.get({
                    'longitude': user.longitude,
                    'latitude': user.latitude,
                }, function(data) {
                    $rootScope.eGuard = $scope.eGuard = data.data[0];
                }, function(data) {
                    alert('NO DATA');
                });
            })
        }
    }
})

.directive('cart', function() {
    return {
        restrict: 'A',
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
        templateUrl: 'templateDirectives/singleCart.html',
        controller: function($scope, $rootScope, $ionicModal, $state, ShoppingCart, UserInfo) {
            UserInfo.then(function (user) {
                cartNumber = ShoppingCart.get($scope.good);
            $scope.singleNumber = cartNumber;
            if ($scope.singleNumber > 0) {
                $scope.isHideAddCart = true;
            }

            $scope.$on('cartChange', function(event, data) {
                cartNumber = ShoppingCart.get($scope.good);
                $scope.singleNumber = cartNumber;
                if ($scope.singleNumber > 0) {
                    $scope.isHideAddCart = true;
                }else{
                    $scope.isHideAddCart = false;
                }
            });
            $scope.addCart = function(event, good) {
                event.stopPropagation();
                event.preventDefault();
                if (!(user.verify - 0)) {
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
            })

            
        }
    }
})

;
