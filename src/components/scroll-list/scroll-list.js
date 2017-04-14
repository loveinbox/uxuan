angular.module('starter.directives')

.directive('scrollList', function() {
  return {
    restrict: 'E',
    scope: {
      type: '=',
      shop: '=',
      goodList: '=',
      classList: '='
    },
    templateUrl: './build/components/scroll-list/scroll-list.html',
    controller: function($scope, $stateParams, $ionicScrollDelegate, $timeout) {
      var scrollObj = {};
      var indexArray = [];
      var count = 0;
      var lastId = -1;
      var indexCount = 0;

      $scope.currentIndex = 0;
      $scope.$watch('goodList', function(nv) {
        if (nv && nv.length > 0) {
          $scope.goodList
            .forEach(function(el, index) {
              if (el.productClassifyId != lastId) {
                lastId = el.productClassifyId;
                scrollObj[el.productClassifyId] = count;
                indexArray[count] = indexCount++;
              }
              count++;
            });
        }
      })

      $scope.scrollTo = function(classifyId, index) {
        $scope.currentIndex = index;
        $ionicScrollDelegate.$getByHandle('wash-scroll').scrollTo(0, scrollObj[classifyId] * 80,
          true);
        $scope.getScrollPosition = null;
        $timeout(function() {
          $scope.getScrollPosition = getOffSet;
        }, 500);
      }
      $scope.getScrollPosition = getOffSet;

      function getOffSet() {
        var currentScroll = $ionicScrollDelegate.$getByHandle('wash-scroll').getScrollPosition().top;
        var getIndex = 0;
        for (var p in scrollObj) {
          if (scrollObj[p] * 80 < currentScroll) {
            getIndex = scrollObj[p];
            continue;
          }
        }
        if ($scope.currentIndex !== indexArray[getIndex]) {
          $scope.currentIndex = indexArray[getIndex];
          $scope.getScrollPosition = null;
          $timeout(function() {
            $scope.getScrollPosition = getOffSet;
          }, 100);
        }
      }
    }
  }
})
