angular.module('starter.directives')

.directive('bigPic', function() {
  return {
    restrict: 'A',
    scope: {},
    link: function(scope, element, attr) {
      var picModal = angular.element('<div class="mask">')

      angular.element(document).find('body').append(picModal)
      picModal.bind('click', function(event) {
        picModal.css({
          'display': 'none',
        });
        picModal.empty();
      });

      element.bind('click', function(event) {
        picModal.css({
          'display': 'block',
        });
        let img = angular.element('<img>')
          .attr('src', attr.ngSrc)
          .css({
            'display': 'block',
            'width': '75%',
            'margin': '150px auto'
          });
        picModal.append(img)
      });

      scope.$on('$destroy', function() {
        picModal.remove()
      });
    }
  }
})

.directive('toTop', function() {
  return {
    restrict: 'E',
    controller: function($scope, $ionicScrollDelegate) {
      const topTip = angular.element(`<div class="fixed" ng-click="goTop()">回到顶部</div>`)

      angular.element(document).find('body').append(topTip)

      topTip.bind('click', function(event) {
        $ionicScrollDelegate.scrollTop(true)
      });

      $scope.$on('$destroy', function() {
        $('div.fixed').remove()
      });
    }
  }
})


.factory('isTooFar', function(UserInfo, $q, $ionicPopup) {
  return function isTooFar(address) {
    address = address || '';
    var deferred = $q.defer();

    UserInfo.then(function(user) {
      var gc = new BMap.Geocoder();
      gc.getPoint(address, function(point) {
        var map = new BMap.Map("allmap");
        var pointA = new BMap.Point(user.longitude, user.latitude); // 创建点坐标A
        var pointB = new BMap.Point(point.lng, point.lat); // 创建点坐标B
        var distacne = (map.getDistance(pointA, pointB)).toFixed(2);
        if (distacne > 6000) {
          showAlert()
          deferred.reject();
        } else {
          deferred.resolve();
        }
      });
    })

    function showAlert() {
      $ionicPopup.alert({
        title: 'U选到家',
        template: '收货地址超出您选择店面服务范围'
      });
    }

    return deferred.promise;

  }
})
