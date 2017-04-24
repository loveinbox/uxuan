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

  function register(url) {
    WxRegister.get({ url })
      .$promise
      .then(res => {
        wx.config({
          debug: false,
          appId: res.appId,
          timestamp: res.timestamp,
          nonceStr: res.nonceStr,
          signature: res.signature,
          jsApiList: ['checkJsApi']
        });
        wx.error(function(res) {
          register('http://www.lifeuxuan.com/app/cart/fruit');
        });
      })
  }
})

angular.module('starter.controllers', []);
angular.module('starter.services', ['ngResource']);
angular.module('starter.directives', [])
