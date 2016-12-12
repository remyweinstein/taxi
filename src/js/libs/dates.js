define(function() {
  
  var Dates = {

      datetimeForPeople: function (date, options) {
        if (!options) {
            options = "TIME_AND_TODAY";
        }

        date = date.split(" ");
        var date_order = date[0].split("-");
        var time_order = date[1].split(":");
        var today_text = '';
        var time_text = time_order[0] + ':' + time_order[1];
        var now = new Date();
        var order_time = new Date(date);
        var today = new Date(now.getFullYear(), now.getMonth()+1, now.getDate()).valueOf();
        var other = new Date(date_order[0], date_order[1], date_order[2]).valueOf();

        if (other < today - 86400000) {
          today_text = date_order[2] + '.' + date_order[1] + '.' + date_order[0];
        } else if (other < today) {
          today_text = "Вчера";
        } else {
          today_text = "Сегодня";
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
          } else {
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
      
      diffTime: function (start, timer) {
        var now = new Date().valueOf();
        var start = start.split(" ");
          var start_date = start[0];
            start_date = start_date.split("-");
          var start_time = start[1];
            start_time = start_time.split(":");
        start = new Date(start_date[0], (start_date[1] - 1), start_date[2], start_time[0], start_time[1], start_time[2]).valueOf();

        return timer - (now / 60000 - start / 60000).toFixed(0);
      }


  };
  
  return Dates;

});
