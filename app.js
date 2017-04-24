window.onerror = function(message, source, lineno, colno, error) {
  var errorMessage = 'message' + message + 'source' + source + 'lineno' + lineno + 'colno' + colno + 'error' + error;
  var httpRequest = new XMLHttpRequest();
  httpRequest.open('GET', 'http://error.lifeuxuan.com?err=' + errorMessage);
  httpRequest.send();
}
angular.module('starter', ['ionic',
  'starter.controllers', 'starter.directives', 'starter.services'
])

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $locationProvider) {
  $locationProvider.html5Mode(true)
  $ionicConfigProvider.tabs.position('bottom')
  $ionicConfigProvider.views.transition('none');
})

angular.module('starter.controllers', []);
angular.module('starter.services', ['ngResource']);
angular.module('starter.directives', [])

.run(function run($rootScope) {
  register();

  function register() {
    $.ajax({
        url: 'http://www.lifeuxuan.com/index.php/wxctrl/register',
        type: 'GET',
        dataType: 'json',
        data: {
          'url': window.location.href
        }
      })
      .done(function(e) {
        wx.config({
          debug: false,
          appId: e.appId,
          timestamp: e.timestamp,
          nonceStr: e.nonceStr,
          signature: e.signature,
          jsApiList: ['checkJsApi', 'openAddress', 'getLocation']
        });
        wx.error(function(res) {
          register2();
        });
      })
      .fail(function(e) {
        // register2();
      })
      .always(function() {});
  };

  function register2() {
    $.ajax({
        url: 'http://www.lifeuxuan.com/index.php/wxctrl/register',
        type: 'GET',
        dataType: 'json',
        data: {
          'url': 'http://www.lifeuxuan.com/app/cart'
        }
      })
      .done(function(e) {
        wx.config({
          debug: false,
          appId: e.appId,
          timestamp: e.timestamp,
          nonceStr: e.nonceStr,
          signature: e.signature,
          jsApiList: ['checkJsApi', 'openAddress', 'getLocation']
        });
        wx.error(function(res) {});
      })
      .fail(function(e) {
        // alert(e);
      })
      .always(function() {});
  };
})
