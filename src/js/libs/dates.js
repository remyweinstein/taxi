define(function() {
  
  function rightHour(num) {
    if (num === 1) {
      return 'час';
    }
    if (num > 1 && num < 5 ) {
      return 'часа';
    }

    return 'часов';
  }

  var Dates = {

      datetimeForPeople: function (date, options) {
        if (!date) {
          return;
        }
        
        if (!options) {
            options = "TIME_AND_TODAY";
        }
        date = date.split(" ");
        
        var date_order = date[0].split("-"),
            time_order = date[1].split(":"),
            today_text,
            time_text = time_order[0] + ':' + time_order[1],
            now = new Date(),
            order_time = new Date(date),
            today = new Date(now.getFullYear(), now.getMonth()+1, now.getDate()).valueOf(),
            yesterday = today - 86400000,
            tomorrow = today + 86400000,
            other = new Date(date_order[0], date_order[1], date_order[2]).valueOf();
        
        switch (other) {
          case yesterday:
            today_text = "Вчера";
            break;
          case tomorrow:
            today_text = "Завтра";
            break;
          case today:
            today_text = "Сегодня";
            break;
          default:
            today_text = date_order[2] + '.' + date_order[1] + '.' + date_order[0];
            break;
        }

        if (options === "ONLY_TIME") {
          date = time_text;
        }
        
        if (options === "ONLY_TIME_IF_TODAY") {
          date = today_text === "Сегодня" ? time_text : today_text + ', ' + time_text;
        }
        
        if (options === "TIME_AND_TODAY") {
          date = today_text + ', ' + time_text;
        }
        
        if (options === "TIME_AND TODAY_ONLY") {
          date = today_text !== "Вчера" && today_text !== "Сегодня" ? today_text : today_text + ', ' + time_text;
        }
        
        if (options === "LEFT_TIME_OR_DATE") {
          //today, other, 1000 * 60 {one minute};
          var diff = now - order_time;
          
          diff = Math.round(diff/60000);
          if (diff > 60) {
            var hours = Math.floor(diff/60);
            diff = hours + 'ч.' + (diff - hours * 60) + 'мин.';
          } else if (diff > 0) {
            diff = diff + 'мин.';
          } else  if (diff < 1) {
            diff = 'Только что';
          }
          date = today_text === 'Сегодня' ? diff :  today_text + ', ' + time_text;
        }

        return date;
      },

      dateFromBase: function (dob) {
        if (dob === "0000-00-00") {
          dob = "";
        } else {
          dob = dob.split("-");
          dob = dob[2] + '.' + dob[1] + '.' + dob[0];
        }

        return dob;
      },
      
      dateToBase: function (dob) {
        dob = dob.split('.');
        dob = dob[2] + '-' + dob[1] + '-' + dob[0];

        return dob;
      },
      
      minToHours: function (min) {
        var s_min = ' мин.',
            s_hour = ' ч.',
            s_day = ' д.',
            s_month = ' м.',
            s_year = ' г.';
          
        if (min < 60) {
          return min + s_min;
        }
        if (min >= 60 && min < 1440) {
          var hour = Math.floor(min / 60);
          
          min = min - (hour * 60);
          
          return hour + s_hour + ' ' + min + s_min;
        }
        if (min >= 1440) {
          var day = Math.floor(min / (60 * 24));
          
          min = min - (day * 60 * 24);
          
          var hour = Math.floor(min / 60);
          
          min = min - (hour * 60);
          
          return day + s_day + ' ' + hour + s_hour + ' ' + min + s_min;
        }
      },
      
      diffTime: function (start, timer) {
        var now = new Date().valueOf(),
            start = start.split(" "),
            start_date = start[0];
          
        start_date = start_date.split("-");
        
        var start_time = start[1];
        
        start_time = start_time.split(":");
        start = new Date(start_date[0], (start_date[1] - 1), start_date[2], start_time[0], start_time[1], start_time[2]).valueOf();

        return timer + 1 - (now / 60000 - start / 60000).toFixed(0);
      }


  };
  
  return Dates;

});
