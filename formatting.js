//defer formatting.js
function formatPhone(field) {
    field.value = trim(field.value);
    var ov = field.value;
    var v = "";
    var x = -1;
    if (0 < ov.length && '+' != ov.charAt(0)) { // format it
        var n = 0;
        if ('1' == ov.charAt(0)) {  // skip it
            ov = ov.substring(1, ov.length);
        }
        for (i = 0; i < ov.length; i++) {
            var ch = ov.charAt(i);
            if (ch >= '0' && ch <= '9') {
                if (n == 0) v += "(";
                else if (n == 3) v += ") ";
                else if (n == 6) v += "-";
                v += ch;
                n++;
            }
            if (! (ch >= '0' && ch <= '9') && ch != ' ' && ch != '-' && ch != '.' && ch != '(' && ch != ')') {
                x = i;
                break;
            }
        }
        if (x >= 0) v += " " + ov.substring(x, ov.length);
        if (n == 10 && v.length <= 40) field.value = v;
    }
    return true;
}
function formatClean(num) {
    var sVal='';
    var nVal = num.length;
    var sChar='';
    try {
        for(i=0;i < nVal;i++) {
            sChar = num.charAt(i);
            nChar = sChar.charCodeAt(0);
            if ( sChar == getDecimalSeparator() || ((nChar >= 48) && (nChar <= 57)))  {
                sVal += num.charAt(i);
            }
        }
    }
    catch (exception) {
        alertError("formatClean",exception);
    }
    return sVal;
}
function formatCurrency(num) {
    var sVal='';
    var minus='';
    if (num.lastIndexOf("-") == 0) {
        minus='-';
    }
    if (num.lastIndexOf(Decimal) < 0) {
        num = num + '00';
    }
    num = formatClean(num);
    sVal = minus + formatDollar(num, getGroupingSeparator()) + getDecimalSeparator() + formatCents(num);
    return sVal;
}
function formatNumber(num) {
    if (num.length == 0)
        return num;
    num = new String(num);
    var sVal='';
    var minus='';
    try  {
        if (num.lastIndexOf("-") == 0) {
            minus='-';
        }
        num = "0" + formatClean(num);
        var fraction = parseFraction(new String(num));
        num = parseInt(num, 10);
        var samount = new String(num);
        for (var i = 0; i < Math.floor((samount.length-(1+i))/3); i++) {
            samount = samount.substring(0,samount.length-(4*i+3)) + getGroupingSeparator() + samount.substring(samount.length-(4*i+3));
        }
        if (fraction.length > 0) {
            fraction = getDecimalSeparator() + fraction;
            samount += fraction;
        }
    } catch (exception) {
        alertError("Format Number",exception);
    }
    return minus + samount;
}
function parseFraction(num) {
    var index = num.indexOf(getDecimalSeparator());
    if (index == -1)
        return "";
    return num.substring(index + 1);
}
function formatCents(amount) {
    var cents = '';
    try {
        amount = parseInt(amount, 10);
        var samount = new String(amount);
        if (samount.length == 0) {
            return '00';
        }
        if (samount.length == 1) {
            return '0' + samount;
        }
        if (samount.length == 2) {
            return samount;
        }
        cents =  samount.substring(samount.length -2,samount.length);
    }
    catch (exception) {
        alertError("Format Cents",e);
    }
    return cents;
}
function formatDollar(amount) {
    try  {
        amount = parseInt(amount, 10);
        var samount = new String(amount);
        if (samount.length < 3)
            return 0;
        samount =  samount.substring(0,samount.length -2);
        for (var i = 0; i < Math.floor((samount.length-(1+i))/3); i++) {
            samount = samount.substring(0,samount.length-(4*i+3)) + getGroupingSeparator() + samount.substring(samount.length-(4*i+3));
        }
    }
    catch (exception) {
        alertError("Format Dollar",e);
    }
    return samount;
}
function padLeft(value, width, fill) {
    value = value + '';
    while (value.length < width)
        value = fill + value;
    return value;
}
function getDecimalSeparator() {
    if (g_user_decimal_separator)
        return g_user_decimal_separator;
    return ".";
}
function getGroupingSeparator() {
    if (g_user_grouping_separator)
        return g_user_grouping_separator;
    return ",";
}
function alertError(MethodName,e) {
    if (e.description == null) {
        alert(MethodName + " Exception: " + e.message);
    }
    else {
        alert(MethodName + " Exception: " + e.description);
    }
}