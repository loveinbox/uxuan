angular.module('starter.directives')

.directive('uTimePick', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      sendDate: '=',
      sendTime: '='
    },
    templateUrl: './build/components/settlement/time.html',
    controller: function($scope, $stateParams) {
      let weekArray = ['日', '一', '二', '三', '四', '五', '六'];
      let date = new Date;
      let startHour = date.getHours() > 8 ? date.getHours() : 8;
      let startDay = startHour >= 20 ? 1 : 0;

      date.setDate(date.getDate() + startDay);
      $scope.timePick = {
        avaliableWeek: weekArray[(date.getDay() + startDay) % 7],
        AvaliableDates: [],
        AvaliableTimes: []
      };

      initAvaliableDate();
      initAvaliableTime();

      $scope.sendDate.current = $scope.timePick.AvaliableDates[0].value
      $scope.sendTime.current = $scope.timePick.AvaliableTimes[0].value

      $scope.changeDate = function changeDateFunction(index) {
        // 选择当天时间
        if (index === 0) {
          initAvaliableTime(startHour);
        } else {
          initAvaliableTime();
        }
      }

      /*-----------------------------------------------------------------*/

      function initAvaliableDate() {
        for (let i = 0 + startDay; i < 8; i++) {
          $scope.timePick.AvaliableDates.push({
            name: getFormatedDate(i),
            value: getFormatedDate(i)
          })
        }
      }

      function initAvaliableTime(startHour) {
        startHour = startHour || 8
        for (let i = startHour; i < 21; i++) {
          $scope.timePick.AvaliableTimes.push({
            name: addZero(i) + ':00 -- ' + addZero(i) + ':30',
            value: addZero(i) + ':00 -- ' + addZero(i) + ':30'
          })
          $scope.timePick.AvaliableTimes.push({
            name: addZero(i) + ':30 -- ' + addZero(i + 1) + ':00',
            value: addZero(i) + ':30 -- ' + addZero(i + 1) + ':00'
          })
        }
      }

      function getFormatedDate(dayOff) {
        dayOff = dayOff || 1;
        let date = new Date();
        date.setDate(date.getDate() + dayOff);
        let year = date.getFullYear()
        let month = date.getMonth() + 1;
        let day = date.getDate();
        return year + '-' + addZero(month) + '-' + addZero(day);
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
