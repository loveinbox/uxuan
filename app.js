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

.run(function run($rootScope, WxRegister) {
  register(window.location.href);

  function register(href) {
    WxRegister.get({
      'url': href
    }).then(res => {
      wx.config({
        debug: false,
        appId: e.appId,
        timestamp: e.timestamp,
        nonceStr: e.nonceStr,
        signature: e.signature,
        jsApiList: ['checkJsApi']
      });
      wx.error(function(res) {
        register('http://www.lifeuxuan.com/app/cart');
      });
    })
  }
})



angular.module('starter.controllers', []);
angular.module('starter.services', ['ngResource']);
angular.module('starter.directives', [])
