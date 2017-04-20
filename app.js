angular.module('starter', ['ionic',
  'starter.controllers', 'starter.directives', 'starter.services'
])

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $locationProvider) {
  $locationProvider.html5Mode(true)
  $ionicConfigProvider.tabs.position('bottom')
  $ionicConfigProvider.views.transition('none');
})

// .config(function($httpProvider) {
//   $httpProvider.interceptors.push('HttpResponseInterceptor');
// })

// .factory('HttpResponseInterceptor', HttpResponseInterceptor);

angular.module('starter.controllers', []);
angular.module('starter.services', ['ngResource']);
angular.module('starter.directives', [])

// angular.module('starter.controllers')

// .run(function run($rootScope) {
//   register();

//   function register() {
//     $.ajax({
//         url: 'http://www.lifeuxuan.com/index.php/wxctrl/register',
//         type: 'GET',
//         dataType: 'json',
//         data: {
//           'url': window.location.href
//         }
//       })
//       .done(function(e) {
//         wx.config({
//           debug: false,
//           appId: e.appId,
//           timestamp: e.timestamp,
//           nonceStr: e.nonceStr,
//           signature: e.signature,
//           jsApiList: ['checkJsApi', 'openAddress', 'getLocation']
//         });
//         wx.error(function(res) {
//           register2();
//         });
//       })
//       .fail(function(e) {
//         // register2();
//       })
//       .always(function() {});
//   };

//   function register2() {
//     $.ajax({
//         url: 'http://www.lifeuxuan.com/index.php/wxctrl/register',
//         type: 'GET',
//         dataType: 'json',
//         data: {
//           'url': 'http://www.lifeuxuan.com/app/cart'
//         }
//       })
//       .done(function(e) {
//         wx.config({
//           debug: false,
//           appId: e.appId,
//           timestamp: e.timestamp,
//           nonceStr: e.nonceStr,
//           signature: e.signature,
//           jsApiList: ['checkJsApi', 'openAddress', 'getLocation']
//         });
//         wx.error(function(res) {});
//       })
//       .fail(function(e) {
//         // alert(e);
//       })
//       .always(function() {});
//   };
// })

// function HttpResponseInterceptor($q, $log) {

//   function req(request) {
//     return request;
//   }

//   function res(response) {
//     function shequResponse(response) {
//       if (typeof response.data === 'string' || response.data.code == 0) {
//         return response;
//       } else {
//         //        alert('操作失败' + response.data && response.data.msg)
//         return $q.reject(response);
//       }
//     }
//     return shequResponse(response);
//   }

//   function responseError(response) {
//     switch (response.status) {
//       case 403:
//         alert('您没有权限访问这一资源');
//         break;
//       case 404:
//         alert('您要访问的资源似乎不存在');
//         break;
//         //      default:
//         //        alert('数据错误');
//     }
//     return response; //$q.reject(response);

//   }

//   return {
//     request: req,
//     response: responseError,
//     responseError: responseError,
//   };

// }
