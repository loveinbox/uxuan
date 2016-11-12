angular.module('starter.directives', [])

.directive('goBack', function() {
  return {
    restrict: 'A',
    replace: true,
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

.directive('eGuard', function() {
  return {
    restrict: 'A',
    replace: true,
    template: '<p class="guard">管家<strong>{{eGuard.name}}</strong>为您服务</p>',
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

.directive('addCart', function() {
  return {
    restrict: 'A',
    replace: true,
    // scope: {
    //   gParamId: '@'
    // },
    templateUrl: 'templateDirectives/addCart.html',
    controller: function($scope, $rootScope, ShoppingCart, UserInfo) {
      $scope.$on('cartChange', function(event, data) {
        $scope.singleNumber = ShoppingCart.get($scope.session);
        if ($scope.singleNumber > 0) {
          $scope.isHideAddCart = true;
        } else {
          $scope.isHideAddCart = false;
        }
      });
      UserInfo.then(function(user) {
        if ($scope.singleNumber > 0) {
          $scope.isHideAddCart = true;
        }
        $scope.addCart = function(event, good) {
          event.stopPropagation();
          if (!(user.verify - 0)) {
            $state.go('phoneNumberCheck');
            return;
          }
          ShoppingCart.add(event, good);
          $rootScope.$broadcast('cartChange');
        };
        $scope.removeCart = function(good) {
          event.stopPropagation();
          ShoppingCart.remove(good);
          $rootScope.$broadcast('cartChange');
        };
      })
    }
  }
})

.directive('cartModalIcon', function() {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'templateDirectives/cartModalIcon.html',
    controller: function($scope, $rootScope, $ionicModal, ShoppingCart) {
      $scope.$on('cartChange', function(event, data) {
        $scope.totalNumber = ShoppingCart.getSellerCartNumber($scope.session.sellerId);
      });
      // $ionicModal.fromTemplateUrl('templateDirectives/cartModal.html', {
      //   scope: $scope,
      //   animation: 'slide-in-up'
      // }).then(function(modal) {
      //   $scope.modal = modal;
      //   $scope.modal.hide();
      // });
      // $scope.openModal = function() {
      //   if ($scope.cart.number > 0) {
      //     $scope.modal.show();
      //     $scope.cartGoods = ShoppingCart.getSellerProductList(gParamId);
      //   }
      // };
      // $scope.closeModal = function() {
      //   $scope.modal.hide();
      // };

    }
  }
})

.directive('singleCart', function() {
  return {
    restrict: 'A',
    templateUrl: 'templateDirectives/singleCart.html',
    controller: function($scope, $rootScope, ShoppingCart, UserInfo) {
      UserInfo.then(function(user) {
        $scope.singleNumber = ShoppingCart.get($scope.good);
        if ($scope.singleNumber > 0) {
          $scope.isHideAddCart = true;
        }

        $scope.$on('cartChange', function(event, data) {
          $scope.singleNumber = ShoppingCart.get($scope.good);
          if ($scope.singleNumber > 0) {
            $scope.isHideAddCart = true;
          } else {
            $scope.isHideAddCart = false;
          }
        });
        $scope.addCart = function(event, good) {
          event.stopPropagation();
          if (!(user.verify - 0)) {
            $state.go('phoneNumberCheck');
            return;
          }
          ShoppingCart.add(event, good);
          $rootScope.$broadcast('cartChange');
        };

        $scope.removeCart = function(good) {
          event.stopPropagation();
          ShoppingCart.remove(good);
          $rootScope.$broadcast('cartChange');
        };
      })
    }
  }
})

.directive('uxuanTime', function() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      userPreferTime: '='
    },
    templateUrl: 'templateDirectives/timePick.html',
    controller: function($scope, $stateParams) {
      var weekArray = ['日', '一', '二', '三', '四', '五', '六'];
      var date = new Date;
      var startHour = date.getHours() > 8 ? date.getHours() : 8;
      var weight = startHour >= 20 ? 1 : 0;
      $scope.tp = {};

      console.log($scope.userPreferTime);
      // console.log($scope.userPreferTime());

      initDate();
      $scope.changeDate = changeDateFunction;
      $scope.changeTime = changeTimeFunction;

      function initDate() {
        $scope.tp.week = weekArray[date.getDay() + weight];
        $scope.tp.dates = [];
        for (var i = 0 + weight; i < 8; i++) {
          $scope.tp.dates.push({
            name: addDate(date, i),
            value: i
          })
        }
        $scope.tp.preferDate = weight;
        initTime(weight);
        setOrderDate(0);
      }

      function changeDateFunction($index) {
        startHour = date.getHours() > 8 ? date.getHours() : 8;
        weight = startHour >= 20 ? 1 : 0;
        if ($scope.tp.preferDate > 0) {
          weight = 1;
        }
        initTime(weight);
        // $scope.tp.preferDate is used as index
        setOrderDate($scope.tp.preferDate);
      }

      function initTime(weight) {
        $scope.tp.times = [];
        if (weight == 0) {
          for (var i = 1; startHour + i < 21; i++) {
            $scope.tp.times.push({
              name: addZero(startHour + i) + ':00 -- ' + addZero(startHour + i) + ':30',
              value: addZero(startHour + i) + ':00 -- ' + addZero(startHour + i) + ':30'
            })
            $scope.tp.times.push({
              name: addZero(startHour + i) + ':30 -- ' + addZero(startHour + i + 1) + ':00',
              value: addZero(startHour + i) + ':30 -- ' + addZero(startHour + i + 1) + ':00'
            })
          }
        } else {
          for (var i = 8; i < 21; i++) {
            $scope.tp.times.push({
              name: addZero(i) + ':00 -- ' + addZero(i) + ':30',
              value: addZero(i) + ':00 -- ' + addZero(i) + ':30'
            })
            $scope.tp.times.push({
              name: addZero(i) + ':30 -- ' + addZero(i + 1) + ':00',
              value: addZero(i) + ':30 -- ' + addZero(i + 1) + ':00'
            })
          }
        }
        $scope.tp.preferTime = $scope.tp.times[0].value;
      }

      function changeTimeFunction(argument) {
        setOrderDate();
      }

      function setOrderDate(dayOff) {
        var pDate = addDate(date, dayOff);
        $scope.userPreferTime.value = [
          date.getFullYear() + '-' + pDate + ' ' + $scope.tp.preferTime.split(' -- ')[0] + ':00',
          date.getFullYear() + '-' + pDate + ' ' + $scope.tp.preferTime.split(' -- ')[1] + ':00'
        ];
      }

      // $scope.$watch('userPreferTime.value',function () {
      //   console.log($scope.userPreferTime.value);
      // })

      function addDate(date, days) {
        if (days === undefined || days === '') {
          days = 1;
        }
        var date = new Date(date);
        date.setDate(date.getDate() + days);
        var month = date.getMonth() + 1;
        var day = date.getDate();
        return addZero(month) + '-' + addZero(day);
      }

      function addZero(number) {
        if (number >= 10) {
          return number + '';
        } else {
          return '0' + '' + number;
        }
      }

    }
  }
})

;
