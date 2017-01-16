angular.module('starter.directives', [])

.directive('bigPic', function() {
  return {
    restrict: 'A',
    scope: {},
    link: function(scope, element, attr) {
      var picModal = $('<div class="pic-modal">').appendTo('body');
      picModal.click(function(event) {
        picModal.hide();
        picModal.empty();
      });
      element.on('click', function(event) {
        let img = $('<img>')
          .attr('src', attr.ngSrc)
          .css({
            'display': 'block',
            'max-width': '95%',
            'margin': '50px auto'
          });
        picModal.append(img).show();
      });
    }
  }
})

.directive('goBack', function() {
  return {
    restrict: 'A',
    replace: true,
    template: '<div class="back-wrap" ng-click="myGoBack()"> ' +
      '<i class="ion-arrow-left-c"></i><span>返回</span>' + '</div>',
    controller: function($scope, $state, $ionicHistory) {
      $scope.myGoBack = function() {
        $backView = $ionicHistory.backView();
        if ($backView) {
          $backView.go();
        } else {
          $state.go('app.sessions')
        }
      };
    }
  }
})

.directive('eGuard', function() {
  return {
    restrict: 'A',
    replace: true,
    template: '<p class="guard">管家<strong>{{eGuard.eguardName}}</strong>为您服务</p>',
    controller: function($scope, $rootScope, NearByEguard, Location, UserInfo) {
      UserInfo.then(function(user) {
        NearByEguard.get({
          'longitude': user.longitude,
          'latitude': user.latitude,
        }, function(data) {
          $rootScope.eGuard = data.data[0];
        }, function(data) {
          alert('NO DATA');
        });
      })
    }
  }
})


.directive('payOrder', function() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      order: '@'
    },
    transclude: true,
    template: '<button ng-click="rePay($event, {{order}})" ng-transclude></button>',
    controller: function($scope, WxPayParam, $state) {
      $scope.rePay = function(event, order) {
        event.stopPropagation();
        event.preventDefault();
        var data = order.orderType === 17001 ? {
          'orderIdsList': [order.orderId],
          'orderType': 17001
        } : {
          'orderIdsList': [order.orderId],
          'orderType': 17002
        };
        data.money = order.money;
        WxPayParam.set(data);
        $state.go('pay');
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
        $scope.singleNumber = ShoppingCart.getGoodNumber($scope.good, $scope.shop);
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
        $scope.addCart = function(event, good, shop) {
          event.stopPropagation();
          // console.log('1-->', user.verify);
          if (!(user.verify - 0)) {
            $state.go('phoneNumberCheck');
            return;
          }
          ShoppingCart.add(event, good, shop);
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
    controller: function($scope, $rootScope, $ionicModal, ShoppingCart, FuritOrWash) {
      var type = FuritOrWash.get();
      $scope.$on('cartChange', function(event, data) {
        $scope.totalNumber = ShoppingCart.getshopCartNumber($scope.shop.shopId, type);
        $scope.totalMoney = ShoppingCart.getshopCartMoney($scope.shop.shopId, type);
      });
      $ionicModal.fromTemplateUrl('templateDirectives/cartModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.hide();
      });
      $scope.openModal = function() {
        if ($scope.totalNumber > 0) {
          $scope.modal.show();
          $scope.cartGoods = ShoppingCart.getshopProductList($scope.shop.shopId, type);
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
    controller: function($scope, $rootScope, $state, ShoppingCart, UserInfo, FuritOrWash) {
      var type = FuritOrWash.get();
      $scope.cartAction = {};
      if ($scope.good) {
        $scope.cartAction.singleNumber = ShoppingCart.getGoodNumber($scope.good, $scope.shop,
          type);
      }
      UserInfo.then(function(user) {
        $scope.$on('cartChange', function(event, data) {
          $scope.cartAction.singleNumber = ShoppingCart.getGoodNumber($scope.good,
            $scope.shop, type);
        });
        $scope.addCart = function(event, good, shop) {
          event.stopPropagation();
          // console.log('1-->', user.verify);
          if (!(user.verify - 0)) {
            $state.go('phoneNumberCheck');
            return;
          }
          ShoppingCart.add(event, good, shop, type);
          $rootScope.$broadcast('cartChange');
        };

        $scope.removeCart = function(good, shop) {
          event.stopPropagation();
          ShoppingCart.remove(good, shop, type);
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
    // scope: {
    //   userPreferTime: '='
    // },
    templateUrl: 'templateDirectives/timePick.html',
    controller: function($scope, $stateParams) {
      var weekArray = ['日', '一', '二', '三', '四', '五', '六'];
      var date = new Date;
      var startHour = date.getHours() > 8 ? date.getHours() : 8;
      var weight = startHour >= 20 ? 1 : 0;
      $scope.tp = {};

      initDate();
      // changeDateFunction;
      $scope.changeTime = changeTimeFunction;

      function initDate() {
        $scope.tp.week = weekArray[(date.getDay() + weight) % 7];
        $scope.tp.dates = [];
        for (var i = 0 + weight; i < 8; i++) {
          $scope.tp.dates.push({
            name: addDate(date, i),
            value: i
          })
        }
        $scope.tp.preferDate = weight;
        initTime(weight);
        setOrderDate(weight);
      }

      $scope.changeDate = function changeDateFunction(index) {
        startHour = date.getHours() > 8 ? date.getHours() : 8;
        weight = startHour >= 20 ? 1 : 0;
        if ($scope.tp.preferDate > 0) {
          weight = 1;
        }
        initTime(weight);
        $scope.tp.week = weekArray[(date.getDay() + index) % 7];
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
              name: addZero(startHour + i) + ':30 -- ' + addZero(startHour + i + 1) +
                ':00',
              value: addZero(startHour + i) + ':30 -- ' + addZero(startHour + i + 1) +
                ':00'
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
        if ($scope.order) {
          $scope.order.sendTime = [
            date.getFullYear() + '-' + pDate + ' ' + $scope.tp.preferTime.split(' -- ')[0] +
            ':00',
            date.getFullYear() + '-' + pDate + ' ' + $scope.tp.preferTime.split(' -- ')[1] +
            ':00'
          ];
        }
      }

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
