angular.module('starter.services')

.service('WxPayParam', function($resource) {
  var param = {
    money: 0
  };
  this.set = function(input) {
    param = input;
  }
  this.get = function() {
    return param;
  }
})

.service('FuritOrWash', function($resource) {
  var furitOrWash = 'furit';
  var washOrder = null;
  var isReserve = false;
  this.toFurit = function() {
    furitOrWash = 'furit';
    // console.log('furitOrWash', furitOrWash);
  }
  this.toWash = function(order, reserve) {
    furitOrWash = 'wash';
    console.log('furitOrWash', furitOrWash);
    if (order !== null) {
      washOrder = order;
    }
    if (reserve !== undefined) {
      isReserve = reserve;
    }
  }
  this.get = function() {
    return furitOrWash;
  }
  this.getParams = function() {
    return {
      washOrder: washOrder,
      isReserve: isReserve
    }
  }
})

;
