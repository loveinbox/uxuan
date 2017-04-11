angular.module('starter.directives')

.directive('goodNearbyList', function() {
  return {
    restrict: 'E',
    scope: {
      listData: '=',
      listType: '@',
      listTitle: '@'
    },
    templateUrl: './build/components/index-good-list/nearby-list.html'
  }
})

.directive('hotList', function() {
  return {
    restrict: 'E',
    scope: {
      hotList: '=',
    },
    templateUrl: './build/components/index-good-list/hot-list.html',
    controller: function($scope, $timeout, $ionicScrollDelegate) {
      $scope.$watch('hotList', function(nv) {
        if (!nv) {
          return
        }
        nv.forEach(function(value) {
          if (value.productType == 17001) {
            value.href = '/good/fruit/' + value.productId;
          } else {
            value.href = '/shop/wash/' + value.shopId;
          }
        });
      })

      $timeout(function() {
        var sv = $ionicScrollDelegate.$getByHandle('horizontal').getScrollView();

        var container = sv.__container;

        var originaltouchStart = sv.touchStart;
        var originalmouseDown = sv.mouseDown;
        var originaltouchMove = sv.touchMove;
        var originalmouseMove = sv.mouseMove;

        container.removeEventListener('touchstart', sv.touchStart);
        container.removeEventListener('mousedown', sv.mouseDown);
        document.removeEventListener('touchmove', sv.touchMove);
        document.removeEventListener('mousemove', sv.mousemove);


        sv.touchStart = function(e) {
          e.preventDefault = function() {}
          originaltouchStart && originaltouchStart.apply(sv, [e]);
        }

        sv.touchMove = function(e) {
          e.preventDefault = function() {}
          originaltouchMove && originaltouchMove.apply(sv, [e]);
        }

        sv.mouseDown = function(e) {
          e.preventDefault = function() {}
          originalmouseDown && originalmouseDown.apply(sv, [e]);
        }

        sv.mouseMove = function(e) {
          e.preventDefault = function() {}
          originalmouseMove && originalmouseMove.apply(sv, [e]);
        }

        container.addEventListener("touchstart", sv.touchStart, false);
        container.addEventListener("mousedown", sv.mouseDown, false);
        document.addEventListener("touchmove", sv.touchMove, false);
        document.addEventListener("mousemove", sv.mouseMove, false);
      })
    }
  }
})
