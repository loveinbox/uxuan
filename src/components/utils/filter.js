angular.module('starter')

.filter('addSeconds', function() {
  return function(input) {
    return input * 1000;
  }
})

.filter('coffeeIdMapText', function() {
  const mapRule = {
    22001: '冷',
    22002: '热',
    23001: '中杯',
    23002: '大杯',
    23003: '超大杯'
  }
  return function(input) {
    return mapRule[input];
  }
})
