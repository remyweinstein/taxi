var Dates = (function() {
    
    
    return{
        datetimeForPeople: function (date,options){
            if(!options){
                options = "TIME_AND_TODAY";
            }
            date = date.split(" ");
            var date_order = date[0].split("-");
            var time_order = date[1].split(":");
            var today_text = '';
            var time_text = time_order[0]+':'+time_order[1];
            var now = new Date();
            var today = new Date(now.getFullYear(), now.getMonth()+1, now.getDate()).valueOf();
            var other = new Date(date_order[0], date_order[1], date_order[2]).valueOf();
            if (other < today - 86400000) {
                today_text = date_order[2]+'.'+date_order[1]+'.'+date_order[0];
            } else if (other < today) {
                today_text = "Вчера";
            } else {
                today_text = "Сегодня";
            }
            if(options==="ONLY_TIME"){
                date = time_text;
            }
            if(options==="ONLY_TIME_IF_TODAY"){
                date = (today_text==="Сегодня")?time_text:today_text+', '+time_text;
            }
            if(options==="TIME_AND_TODAY"){
                date = today_text+', '+time_text;
            }
            if(options==="TIME_AND TODAY_ONLY"){
                date = (today_text!=="Вчера" && today_text!=="Сегодня")?today_text:today_text+', '+time_text;
            }
            return date;
        },
        dateFromBase: function (dob){
            if(dob === "0000-00-00") {
                dob = "";
            } else {
                dob = dob.split("-");
                dob = dob[2]+'.'+dob[1]+'.'+dob[0];
            }
            return dob;
        },
        dateToBase: function (dob){
            dob = dob.split('.');
            dob = dob[2]+'-'+dob[1]+'-'+dob[0];
            return dob;
        },

    };
})();
