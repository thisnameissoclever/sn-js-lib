//defer calendar.js
/* SOURCE FILE: date.js */
var MONTH_NAMES=new Array('January','February','March','April','May','June','July','August','September','October','November','December','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');
var DAY_NAMES=new Array('Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sun','Mon','Tue','Wed','Thu','Fri','Sat');
function LZ(x) {
    return(x<0||x>9?"":"0")+x
    }
function isDate(val,format) {
    var date=getDateFromFormat(val,format);
    if (date==0) {
        return false;
    }
    return true;
}
function compareDates(date1,dateformat1,date2,dateformat2) {
    var d1=getDateFromFormat(date1,dateformat1);
    var d2=getDateFromFormat(date2,dateformat2);
    if (d1==0 || d2==0) {
        return -1;
    }
    else if (d1 > d2) {
        return 1;
    }
    return 0;
}
function formatDateServer(date, format) {
    var ga = new GlideAjax("DateTimeUtils");
    ga.addParam("sysparm_name", "formatCalendarDate");
    var browserOffset = date.getTimezoneOffset() * 60000;
    var utcTime = date.getTime() - browserOffset;
    var userDateTime = utcTime - g_tz_offset;
    ga.addParam("sysparm_value", userDateTime);
    ga.getXMLWait();
    return ga.getAnswer();
}
function formatDate(date,format) {
    if (format.indexOf("z") > 0)
        return formatDateServer(date, format);
    format=format+"";
    var result="";
    var i_format=0;
    var c="";
    var token="";
    var y=date.getYear()+"";
    var M=date.getMonth()+1;
    var d=date.getDate();
    var E=date.getDay();
    var H=date.getHours();
    var m=date.getMinutes();
    var s=date.getSeconds();
    var yyyy,yy,MMM,MM,dd,hh,h,mm,ss,ampm,HH,H,KK,K,kk,k;
    var value=new Object();
    value["M"]=M;
    value["MM"]=LZ(M);
    value["MMM"]=MONTH_NAMES[M+11];
    value["NNN"]=MONTH_NAMES[M+11];
    value["MMMM"]=MONTH_NAMES[M-1];
    value["d"]=d;
    value["dd"]=LZ(d);
    value["E"]=DAY_NAMES[E+7];
    value["EE"]=DAY_NAMES[E];
    value["H"]=H;
    value["HH"]=LZ(H);
    if (format.indexOf('w') != -1) {
        var wk = date.getWeek();
        if (wk >= 52 && M == 1) {
            y = date.getYear();
            y--;
            y = y + "";
        }
        if (wk == 1 && M == 12) {
            y = date.getYear();
            y++;
            y = y + "";
        }
        value["w"] = wk;
        value["ww"] = LZ(wk);
    }
    var dayOfWeek = (7 + (E + 1) - (g_first_day_of_week - 1)) % 7;
    if (dayOfWeek == 0)
        dayOfWeek = 7;
    value["D"] = dayOfWeek;
    if (y.length < 4) {
        y=""+(y-0+1900);
    }
    value["y"]=""+y;
    value["yyyy"]=y;
    value["yy"]=y.substring(2,4);
    if (H==0) {
        value["h"]=12;
    } else if (H>12){
        value["h"]=H-12;
    } else {
        value["h"]=H;
    }
    value["hh"]=LZ(value["h"]);
    if (H>11) {
        value["K"]=H-12;
    } else {
        value["K"]=H;
    }
    value["k"]=H+1;
    value["KK"]=LZ(value["K"]);
    value["kk"]=LZ(value["k"]);
    if (H > 11) {
        value["a"]="PM";
    } else {
        value["a"]="AM";
    }
    value["m"]=m;
    value["mm"]=LZ(m);
    value["s"]=s;
    value["ss"]=LZ(s);
    while (i_format < format.length) {
        c=format.charAt(i_format);
        token="";
        while ((format.charAt(i_format)==c) && (i_format < format.length)) {
            token += format.charAt(i_format++);
        }
        if (value[token] != null) {
            result=result + value[token];
        }
        else {
            result=result + token;
        }
    }
    return result;
}
function _isInteger(val) {
    var digits="1234567890";
    for (var i=0; i < val.length; i++) {
        if (digits.indexOf(val.charAt(i))==-1) {
            return false;
        }
    }
    return true;
}
function _getInt(str,i,minlength,maxlength) {
    for (var x=maxlength; x>=minlength; x--) {
        var token=str.substring(i,i+x);
        if (token.length < minlength) {
            return null;
        }
        if (_isInteger(token)) {
            return token;
        }
    }
    return null;
}
Date.prototype.getWeek = function() {
    var newYear = new Date(this.getFullYear(),0,1);
    var day = newYear.getDay() - (g_first_day_of_week - 1); //the day of week the year begins on
    day = (day >= 0 ? day : day + 7);
    var dayNum = Math.floor((this.getTime() - newYear.getTime() - (this.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1;
    var weekNum;
    if (day < 4) {
        weekNum = Math.floor((dayNum+day-1)/7) +1;
        if (weekNum > 52)
            weekNum = this._checkNextYear(weekNum);
        return weekNum;
    }
    weekNum = Math.floor((dayNum+day-1)/7);
    if (weekNum < 1)
        weekNum = this._lastWeekOfYear();
    else if (weekNum > 52)
        weekNum = this._checkNextYear(weekNum);
    return weekNum;
}
Date.prototype._lastWeekOfYear = function() {
    var newYear = new Date(this.getFullYear() - 1,0,1);
    var endOfYear = new Date(this.getFullYear() - 1,11,31);
    var day = newYear.getDay() - (g_first_day_of_week - 1); //the day of week the year begins on
    var dayNum = Math.floor((endOfYear.getTime() - newYear.getTime() - (endOfYear.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1;
    return day < 4 ? Math.floor((dayNum+day-1)/7) + 1 : Math.floor((dayNum+day-1)/7);
}
Date.prototype._checkNextYear = function() {
    var nYear = new Date(this.getFullYear() + 1,0,1);
    var nDay = nYear.getDay() - (g_first_day_of_week-1);
    nDay = nDay >= 0 ? nDay : nDay + 7;
    /*if the next year starts before the middle of
the week, it is week #1 of that year*/
    return nDay < 4 ? 1 : 53;
}
Date.prototype.setWeek = function(weekNum) {
    weekNum--;
    var startOfYear = new Date(this.getFullYear(), 0, 1);
    var day = startOfYear.getDay() - (g_first_day_of_week - 1); //the day of week the year begins on
    if (day > 0 && day < 4) {
        this.setFullYear(startOfYear.getFullYear() - 1);
        this.setDate(31 - day + 1);
        this.setMonth(11);
    } else if (day > 3)                                   // If we are on Firday or Saturday Sunday
        this.setDate(startOfYear.getDate() + (7-day));    // Set the date to the start of year
    this.setDate(this.getDate() + (7 * weekNum));
}
function getDateFromFormat(val,format) {
    val=val+"";
    format=format+"";
    var i_val=0;
    var i_format=0;
    var c="";
    var token="";
    var token2="";
    var x,y;
    var now=new Date();
    var year=now.getYear();
    var month=now.getMonth()+1;
    var date=0;
    var hh=now.getHours();
    var mm=now.getMinutes();
    var ss=now.getSeconds();
    var ampm="";
    var week = false;
    while (i_format < format.length) {
        c=format.charAt(i_format);
        token="";
        while ((format.charAt(i_format)==c) && (i_format < format.length)) {
            token += format.charAt(i_format++);
        }
        if (token=="yyyy" || token=="yy" || token=="y") {
            if (token=="yyyy") {
                x=4;
                y=4;
            }
            if (token=="yy")   {
                x=2;
                y=2;
            }
            if (token=="y")    {
                x=2;
                y=4;
            }
            year=_getInt(val,i_val,x,y);
            if (year==null) {
                return 0;
            }
            i_val += year.length;
            if (year.length==2) {
                if (year > 70) {
                    year=1900+(year-0);
                }
                else {
                    year=2000+(year-0);
                }
            }
        }
        else if (token=="MMM"||token=="NNN"){
            month=0;
            for (var i=0; i<MONTH_NAMES.length; i++) {
                var month_name=MONTH_NAMES[i];
                if (val.substring(i_val,i_val+month_name.length).toLowerCase()==month_name.toLowerCase()) {
                    if (token=="MMM"||(token=="NNN"&&i>11)) {
                        month=i+1;
                        if (month>12) {
                            month -= 12;
                        }
                        i_val += month_name.length;
                        break;
                    }
                }
            }
            if ((month < 1)||(month>12)){
                return 0;
            }
        }
        else if (token=="EE"||token=="E") {
            for (var i=0; i<DAY_NAMES.length; i++) {
                var day_name=DAY_NAMES[i];
                if (val.substring(i_val,i_val+day_name.length).toLowerCase()==day_name.toLowerCase()) {
                    if (week) {
                        if (i==0 || i == 7) //Sun
                            date+=6;
                        else if (i== 2 || i == 9) //Tues
                            date+=1;
                        else if (i== 3 || i == 10) //Wed
                            date+=2;
                        else if (i == 4 || i == 11) // Thur
                            date+=3;
                        else if (i == 5 || i == 12) //Fri
                            date +=4;
                        else if (i == 6 || i== 13) //sat
                            date+=5;
                    }
                    i_val += day_name.length;
                    break;
                }
            }
        }
        else if (token=="MM"||token=="M") {
            month=_getInt(val,i_val,token.length,2);
            if(month==null||(month<1)||(month>12)){
                return 0;
            }
            i_val+=month.length;
        }
        else if (token=="dd"||token=="d") {
            date=_getInt(val,i_val,token.length,2);
            if(date==null||(date<1)||(date>31)){
                return 0;
            }
            i_val+=date.length;
        }
        else if (token=="hh"||token=="h") {
            hh=_getInt(val,i_val,token.length,2);
            if(hh==null||(hh<1)||(hh>12)){
                return 0;
            }
            i_val+=hh.length;
        }
        else if (token=="HH"||token=="H") {
            hh=_getInt(val,i_val,token.length,2);
            if(hh==null||(hh<0)||(hh>23)){
                return 0;
            }
            i_val+=hh.length;
        }
        else if (token=="KK"||token=="K") {
            hh=_getInt(val,i_val,token.length,2);
            if(hh==null||(hh<0)||(hh>11)){
                return 0;
            }
            i_val+=hh.length;
        }
        else if (token=="kk"||token=="k") {
            hh=_getInt(val,i_val,token.length,2);
            if(hh==null||(hh<1)||(hh>24)){
                return 0;
            }
            i_val+=hh.length;
            hh--;
        }
        else if (token=="mm"||token=="m") {
            mm=_getInt(val,i_val,token.length,2);
            if(mm==null||(mm<0)||(mm>59)){
                return 0;
            }
            i_val+=mm.length;
        }
        else if (token=="ss"||token=="s") {
            ss=_getInt(val,i_val,token.length,2);
            if(ss==null||(ss<0)||(ss>59)){
                return 0;
            }
            i_val+=ss.length;
        }
        else if (token=="a") {
            if (val.substring(i_val,i_val+2).toLowerCase()=="am") {
                ampm="AM";
            }
            else if (val.substring(i_val,i_val+2).toLowerCase()=="pm") {
                ampm="PM";
            }
            else {
                return 0;
            }
            i_val+=2;
        }
        else if (token == "w" || token == "ww") { //week in year
            var weekNum = _getInt(val,i_val,token.length, 2);
            week = true;
            if (weekNum != null) {
                var temp = new Date(year, 0, 1, 0, 0, 0);
                temp.setWeek(parseInt(weekNum, 10));
                year = temp.getFullYear();
                month = temp.getMonth()+1;
                date = temp.getDate();
            }
            weekNum += "";
            i_val += weekNum.length;
        }
        else if (token=="D") {
            if (week) {
                var day = _getInt(val,i_val,token.length, 1);
                if ((day == null) || (day <= 0) || (day > 7))
                    return 0;
                var temp = new Date(year, month-1, date, hh, mm, ss);
                var dayOfWeek = temp.getDay();
                day = parseInt(day, 10);
                day = (day + g_first_day_of_week - 1) % 7;
                if (day == 0)
                    day = 7;
                day--;
                if (day < dayOfWeek)
                    day = 7 - (dayOfWeek - day);
                else
                    day -= dayOfWeek;
                if (day > 0) {
                    temp.setDate(temp.getDate() + day);
                    year = temp.getFullYear();
                    month = temp.getMonth() + 1;
                    date = temp.getDate();
                }
                i_val++;
            }
        } else if (token =="z")
            i_val+=3;
        else {
            if (val.substring(i_val,i_val+token.length)!=token) {
                return 0;
            }
            else {
                i_val+=token.length;
            }
        }
    }
    if (i_val != val.length) {
        return 0;
    }
    if (month==2) {
        if ( ( (year%4==0)&&(year%100 != 0) ) || (year%400==0) ) { // leap year
            if (date > 29){
                return 0;
            }
        }
        else {
            if (date > 28) {
                return 0;
            }
        }
}
if ((month==4)||(month==6)||(month==9)||(month==11)) {
    if (date > 30) {
        return 0;
    }
}
if (hh<12 && ampm=="PM") {
    hh=hh-0+12;
}
else if (hh>11 && ampm=="AM") {
    hh-=12;
}
var newdate=new Date(year,month-1,date,hh,mm,ss);
return newdate.getTime();
}
function parseDate(val) {
    var preferEuro=(arguments.length==2)?arguments[1]:false;
    generalFormats=new Array('y-M-d','MMM d, y','MMM d,y','y-MMM-d','d-MMM-y','MMM d');
    monthFirst=new Array('M/d/y','M-d-y','M.d.y','MMM-d','M/d','M-d');
    dateFirst =new Array('d/M/y','d-M-y','d.M.y','d-MMM','d/M','d-M');
    yearFirst =new Array( 'yyyyw.F', 'yyw.F');
    var checkList=new Array('generalFormats',preferEuro?'dateFirst':'monthFirst',preferEuro?'monthFirst':'dateFirst', 'yearFirst');
    var d=null;
    for (var i=0; i<checkList.length; i++) {
        var l=window[checkList[i]];
        for (var j=0; j<l.length; j++) {
            d=getDateFromFormat(val,l[j]);
            if (d!=0) {
                return new Date(d);
            }
        }
    }
    return null;
}