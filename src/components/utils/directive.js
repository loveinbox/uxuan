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
