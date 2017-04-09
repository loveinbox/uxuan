angular.module('starter.directives')

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
            'width': '95%',
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
        const $backView = $ionicHistory.backView();
        if ($backView) {
          $backView.go();
        } else {
          $state.go('app.index')
        }
      };
    }
  }
})
