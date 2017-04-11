angular.module('starter.directives')

.directive('uTimePick', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: './build/components/settlement/time.html',
    controller: function($scope, $stateParams) {
      var weekArray = ['日', '一', '二', '三', '四', '五', '六'];
      var date = new Date;
      var startHour = date.getHours() > 8 ? date.getHours() : 8;
      var weight = startHour >= 20 ? 1 : 0;
      $scope.tp = {};

      initDate();
      // changeDateFunction;
      $scope.changeTime = changeTimeFunction;

      function initDate() {
        $scope.tp.week = weekArray[(date.getDay() + weight) % 7];
        $scope.tp.dates = [];
        for (var i = 0 + weight; i < 8; i++) {
          $scope.tp.dates.push({
            name: addDate(date, i),
            value: i
          })
        }
        $scope.tp.preferDate = weight;
        initTime(weight);
        setOrderDate(weight);
      }

      $scope.changeDate = function changeDateFunction(index) {
        startHour = date.getHours() > 8 ? date.getHours() : 8;
        weight = startHour >= 20 ? 1 : 0;
        if ($scope.tp.preferDate > 0) {
          weight = 1;
        }
        initTime(weight);
        $scope.tp.week = weekArray[(date.getDay() + index) % 7];
        // $scope.tp.preferDate is used as index
        setOrderDate($scope.tp.preferDate);
      }

      function initTime(weight) {
        $scope.tp.times = [];
        if (weight == 0) {
          for (var i = 1; startHour + i < 21; i++) {
            $scope.tp.times.push({
              name: addZero(startHour + i) + ':00 -- ' + addZero(startHour + i) + ':30',
              value: addZero(startHour + i) + ':00 -- ' + addZero(startHour + i) + ':30'
            })
            $scope.tp.times.push({
              name: addZero(startHour + i) + ':30 -- ' + addZero(startHour + i + 1) +
                ':00',
              value: addZero(startHour + i) + ':30 -- ' + addZero(startHour + i + 1) +
                ':00'
            })
          }
        } else {
          for (var i = 8; i < 21; i++) {
            $scope.tp.times.push({
              name: addZero(i) + ':00 -- ' + addZero(i) + ':30',
              value: addZero(i) + ':00 -- ' + addZero(i) + ':30'
            })
            $scope.tp.times.push({
              name: addZero(i) + ':30 -- ' + addZero(i + 1) + ':00',
              value: addZero(i) + ':30 -- ' + addZero(i + 1) + ':00'
            })
          }
        }
        $scope.tp.preferTime = $scope.tp.times[0].value;
      }

      function changeTimeFunction(argument) {
        setOrderDate();
      }

      function setOrderDate(dayOff) {
        var pDate = addDate(date, dayOff);
        if ($scope.order) {
          $scope.order.sendTime = [
            date.getFullYear() + '-' + pDate + ' ' + $scope.tp.preferTime.split(' -- ')[0] +
            ':00',
            date.getFullYear() + '-' + pDate + ' ' + $scope.tp.preferTime.split(' -- ')[1] +
            ':00'
          ];
        }
      }

      function addDate(date, days) {
        if (days === undefined || days === '') {
          days = 1;
        }
        var date = new Date(date);
        date.setDate(date.getDate() + days);
        var month = date.getMonth() + 1;
        var day = date.getDate();
        return addZero(month) + '-' + addZero(day);
      }

      function addZero(number) {
        if (number >= 10) {
          return number + '';
        } else {
          return '0' + '' + number;
        }
      }

    }
  }
})

;
