function HttpProvider($httpProvider) {
  $httpProvider.interceptors.push('HttpResponseInterceptor');
}

function HttpResponseInterceptor($q, $log) {

  function req(request) {
    return request;
  }

  function res(response) {
    function shequResponse(response) {
      if (typeof response.data === 'string' || response.data.code == 0) {
        return response;
      } else {
//        alert('操作失败' + response.data && response.data.msg)
        return $q.reject(response);
      }
    }
    return shequResponse(response);
  }

  function responseError(response) {
    switch (response.status) {
      case 403:
        alert('您没有权限访问这一资源');
        break;
      case 404:
        alert('您要访问的资源似乎不存在');
        break;
//      default:
//        alert('数据错误');
    }
    return response;//$q.reject(response);

  }

  return {
    request: req,
    response: responseError,
    responseError: responseError,
  };

}

angular.module('starter')
  .config(HttpProvider)
  .factory('HttpResponseInterceptor', HttpResponseInterceptor);
