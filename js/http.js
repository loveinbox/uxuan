function HttpProvider($httpProvider) {
  $httpProvider.interceptors.push('HttpResponseInterceptor');
}

function HttpResponseInterceptor($q, $log) {

  function req(request) {
    return request;
  }

  function res(response) {
    function shequResponse(response) {
      if (response.status == 200) {
        return response;
      } else {
        alert('数据错误' + response.status)
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
      default:
        alert('系统错误');
    }
    return $q.reject(response);

  }

  return {
    request: req,
    response: res,
    responseError: responseError,
  };

}

angular.module('starter')
  .config(HttpProvider)
  .factory('HttpResponseInterceptor', HttpResponseInterceptor);
