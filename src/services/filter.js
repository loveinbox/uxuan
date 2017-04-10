angular.module('starter')

.filter('toTimeStamp', function() {
  return function(input, param) {
    return moment(input).unix() * 1000;
  }
});
