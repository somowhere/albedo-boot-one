if (!Array.prototype.map)
    Array.prototype.map = function (fn, scope) {
        var result = [], ri = 0;
        for (var i = 0, n = this.length; i < n; i++) {
            if (i in this) {
                result[ri++] = fn.call(scope, this[i], i, this);
            }
        }
        return result;
    };
if ($.fn.dataTable)
    $.fn.dataTable.ext.sErrMode = function (settings, tn, msg) {
        if (window.console && console.log) {
            console.log(msg);
        }
    };
var SUCCESS = "success", QUESTION = "question", WRANING = "warning", ERROR = "error", msg_ = false;
/**
 * 获取元素的outerHTML
 */
$.fn.outerHTML = function () {
    // IE, Chrome & Safari will comply with the non-standard outerHTML, all
    // others (FF) will have a fall-back for cloning
    return (!this.length) ? this : (this[0].outerHTML || (function (el) {
        var div = document.createElement('div');
        div.appendChild(el.cloneNode(true));
        var contents = div.innerHTML;
        div = null;
        return contents;
    })(this[0]));
};
$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        var name = this.name, tempObj = o[name], val = this.value || '',
            startIndex = name.indexOf('['), endIndex = name.indexOf(']');
        if (startIndex != -1 && endIndex != -1) {
            var prefix = name.substr(0, startIndex);
            tempObj = o[prefix];
            if (!tempObj) {
                tempObj = []
            }
            var subName = name.substring(endIndex + 2), index = name.substring(startIndex + 1, endIndex);
            if (tempObj[index]) {
                tempObj[index][subName] = val;
            } else {
                var temp = {};
                temp[subName] = val;
                tempObj.push(temp);
            }
            o[prefix] = tempObj;
        } else {
            if (tempObj) {
                if (!tempObj.push) {
                    tempObj = [tempObj];
                }
                tempObj.push(val || '');
            } else {
                tempObj = val || '';
            }
            o[name] = tempObj;
        }

    });
    return o;
};

var albedoConstants = {
    userId: '',
    ctx: '/api',
    token: null,
    gatewayModel: true,
    sessionStorage: null
};
var albedo = function(){
    var _parseJsonItemFormTarget= function ($formId) {
        var i = 0, json_list = [];
        var $target = $formId.length > 0 ? $formId.find("[searchItem='searchItem']")
            : $("[searchItem='searchItem']");
        $target
            .each(function () {
                if (($(this).attr('type') == 'radio' || $(this)
                        .attr('type') == 'checkbox')
                    && !$(this).is(":checked"))
                    return true;
                var format=$(this).attr("format"),val = $(this).val(),s = val ? ( format && format.indexOf(" ")!=-1 ? val.trim()
                    : val.replaceAll(" ", ""))
                    : undefined;
                if (s) {
                    var fieldName = $(this).attr("realName") ? $(this)
                        .attr("realName") : $(this).attr("name");
                    if ($(this).attr('type') == 'checkbox' && json_list
                        && json_list.length > 0) {
                        for (var j = 0; j < json_list.length; j++) {
                            if (json_list[j].fieldName == fieldName) {
                                json_list[j].value += "," + s;
                                return true;
                            }
                        }
                    }
                    var _json = {};
                    _json.fieldName = fieldName;
                    _json.fieldName = fieldName;
                    _json.attrType = $(this).attr("attrType") ? $(this)
                        .attr("attrType") : format ? 'Date' : 'String';
                    if (_json.attrType == "date"
                        || _json.attrType == "Date") {
                        _json.format = format ? format : 'yyyy-MM-dd';
                    }
                    _json.fieldNode = $(this).attr("fieldNode") ? $(this)
                        .attr("fieldNode") : '';
                    _json.operate = $(this).attr("operate") ? $(this).attr(
                        "operate") : 'like';
                    _json.weight = $(this).attr("weight") ? $(this).attr(
                        "weight") : 0;
                    _json.analytiColumn = $(this).attr("analytiColumn") ? $(this).attr(
                        "analytiColumn") : true;
                    _json.analytiColumnPrefix = $(this).attr("analytiColumnPrefix") ? $(this).attr(
                        "analytiColumnPrefix") : null;
                    if (_json.operate == "between") {
                        var endValue = $("input[for-date='" + $(this).attr("name") + "']").val();
                        if(!endValue && s.toString().indexOf(" ~ ")!=-1){
                            var vals = s.split(" ~ ");
                            _json.endValue = vals[1].trim();
                            s = vals[0].trim();
                        }else{
                            _json.endValue = endValue ? (format && format.indexOf(" ")!=-1 ? endValue.trim() : endValue.replaceAll(" ", ""))
                                : undefined;
                        }

                        if (!_json.endValue)
                            return true;
                    }
                    _json.value = s;
                    json_list[i++] = _json;
                }
            })
        return JSON.stringify(json_list);
    }
    var _setFormBoxValue=function($thiz, val) {
        if ($thiz) {
            if ($thiz.is('input') || $thiz.is('textarea')) {
                if ($thiz.attr("type") == "radio"
                    || $thiz.attr("type") == "checkbox") {
                    $thiz.each(function () {
                        $(this).val() == val
                        && $(this).attr("checked", "checked");
                    });
                } else {
                    $thiz.val(val);
                }
            } else if ($thiz.is('select')) {
                $thiz.val(val);
                if ($thiz.attr('class')
                    && $thiz.attr('class').indexOf('chosen-select') != -1) {
                    $thiz.select2("destroy");
                    $thiz.select2();
                }
            } else if ($thiz.is('lebel')) {
                $thiz.text(val);
            }
        }
    }
    var _containSpiltStr= function(str, item, split){
        var tempSplit = split ? split : ",";
        return tempSplit.concat(str, tempSplit).indexOf(tempSplit.concat(item, tempSplit))!=-1;
    }
    return {
        setSessionStorage: function (sessionStorage){
            albedoConstants.sessionStorage=sessionStorage;
        },
        getSessionStorage: function (){
            return albedoConstants.sessionStorage;
        },
        setCookie: function (key, value) {
            Cookies.set(key, value, {
                expires: 7,
                path: '/'
            });
        },
        removeCookie: function (key) {
            Cookies.set(key, null, {
                expires: 0,
                path: '/'
            });
        },
        getCookie: function (key) {
            return Cookies.get(key);
        },
        setUserCookie: function (key, value) {
            Cookies.set(key + this.getUserId(), value, {
                expires: 7,
                path: '/'
            });
        },
        getUserCookie: function (key) {
            return Cookies.get(key + this.getUserId());
        },
        setCtx: function (ctx) {
            albedoConstants.ctx = ctx;
        },
        setGatewayModel: function (gatewayModel) {
            albedoConstants.gatewayModel = gatewayModel;
        },
        getGatewayModel: function () {
            return albedoConstants.gatewayModel ? albedoConstants.gatewayModel : false;
        },
        containSpiltStr: function(str, item, split){
            return _containSpiltStr(str, item, split);
        },
        getCtx: function (permission) {
            var rsCtx = albedoConstants.ctx
            if(permission && albedoConstants.gatewayModel && albedoConstants.sessionStorage ){
                var modules = albedoConstants.sessionStorage.retrieve("modules");
                if(modules && modules.length>0){
                    for (var i = 0; i < modules.length; i++) {
                        var module = modules[i]
                        if (module.microservice && (module.permission == permission || _containSpiltStr(module.permission, permission))) {
                            rsCtx = module.microservice
                            break;
                        }
                    }
                }
            }
            return rsCtx;
        },
        setUserId: function (userId) {
            albedoConstants.userId = userId;
        },
        getUserId: function () {
            return albedoConstants.userId;
        },
        setToken: function (token) {
            albedoConstants.token = token;
        },
        getToken: function () {
            return albedoConstants.token;
        },
        refreshCacheBuster: function () {
            var url = _form.attr("action");
            var d = new Date();
            url = url.replace(/[?|&]cacheBuster=\d+/, '');
            // Some url's allready have '?' attached
            url += config.url.indexOf('?') === -1 ? '?' : '&'
            url += 'cacheBuster=' + d.getTime();
            _form.attr("action", url);
        },
        goTo: function (url, blank) {
            if (blank) {
                window.open(url);
            } else {
                window.location.href = url;
            }
        },// /<summary>获得字符串实际长度，中文2，英文1</summary>
        // /<param name="str">要获得长度的字符串</param>
        getLength: function (str) {
            var realLength = 0, len = str.length, charCode = -1;
            for (var i = 0; i < len; i++) {
                charCode = str.charCodeAt(i);
                if (charCode >= 0 && charCode <= 128)
                    realLength += 1;
                else
                    realLength += 2;
            }
            return realLength;
        },
        // /<summary>切割的最大长度的字符串以</summary>
        // /<param name="str">要获得切割的字符串</param>
        // /<param name="maxLength">最大长度</param>
        // /<param name="suffix">后缀 默认'...'</param>
        subMaxStr: function (str, maxLength, suffix) {
            if (str) {
                var realLength = 0, len = str.length, charCode = -1, suffix = suffix ? suffix
                    : '...';
                for (var i = 0; i < len; i++) {
                    charCode = str.charCodeAt(i);
                    if (charCode >= 0 && charCode <= 128)
                        realLength += 1;
                    else
                        realLength += 2;
                    if (realLength > maxLength) {
                        str = str.substring(0, i) + suffix;
                        break;
                    }
                }
            } else {
                str = '';
            }

            return str;
        },
        toCamelCase: function (str, s) {
            if (!s)
                s = '.';
            if (str) {
                var rs = "", upperCase = false;
                for (var i = 0; i < str.length; i++) {
                    var c = str.charAt(i);
                    if (c == s) {
                        upperCase = true
                    } else if (upperCase) {
                        upperCase = false;
                        rs += c.toUpperCase();
                    } else {
                        rs += c;
                    }
                }
                str = rs;
            }
            return str;
        },// 是否存在指定函数
        isExitsFunction: function (funcName) {
            try {
                if (typeof (eval(funcName)) == "function") {
                    return true;
                }
            } catch (e) {
            }
            return false;
        }
        // 是否存在指定变量
        ,isExitsVariable: function (variableName) {
            try {
                return typeof (variableName) == "undefined" ? false : true;
            } catch (e) {
            }
            return false;
        },
        toStr:function(obj){
            return this.isNull(obj) ? "" : obj;
        },
        isNull: function (variable) {
            try {
                return variable == undefined || variable==null;
            } catch (e) {
            }
            return false;
        },
        isNotNull: function (variable) {
            return !this.isEmpty(variable);
        },
        setFormBoxValue: function ($thiz, val) {
            _setFormBoxValue($thiz, val)
        },

        /**
         * json初始化普通表单
         *
         * json {属性：值,属性：值} formId
         */
        jsonFrom: function (json, formId) {
            albedo.jsonFromObject(json, $("#" + formId));
        },
        jsonFromObject: function (json, $form) {
            if (json) {
                $form.find("[name]") && $form.find("[name]").each(function () {
                    var name = albedo.toCamelCase($(this).attr('name'));
                     _setFormBoxValue($thiz, val)($(this), json[name]);
                });
            }
        }
        /**
         * json初始化查询表单
         *
         * json {queryCondition对象} formId
         */
        ,jsonInitSearchFrom: function (json, formId) {
            var $form = $(formId);
            if (json) {
                for (var i in json) {
                    var $item = $form.find("[name='" + json[i].fieldName + "']");
                    if ($item.length == 0)
                        $item = $form
                            .find("[realname='" + json[i].fieldName + "']");
                     _setFormBoxValue($thiz, val)($item, json[i].value);
                    if (json[i].operation == "between") {
                         _setFormBoxValue($thiz, val)($item.next(), json[i].endValue);
                    }
                }
            }
        },
        /**
         * json初始化查询表单
         *
         * json {queryCondition对象} formId
         */
        parseJsonItemForm: function (formId) {
            return _parseJsonItemFormTarget($(formId))
        },
        /**
         * json初始化查询表单
         *
         * json {queryCondition对象} formId
         */
        parseJsonItemFormTarget: function ($formId) {
            return _parseJsonItemFormTarget($formId)
        }
    }
}();

String.prototype.startWith = function (str) {
    var reg = new RegExp("^" + str);
    return reg.test(this);
}

String.prototype.endWith = function (str) {
    var reg = new RegExp(str + "$");
    return reg.test(this);
}
/**
 * 替换所有 reallyDo：被搜索的子字符串。 replaceWith：用于替换的子字符串。
 *
 * @returns
 */
String.prototype.replaceAll = function (reallyDo, replaceWith, ignoreCase) {
    if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
        return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi" : "g")),
            replaceWith);
    } else {
        return this.replace(reallyDo, replaceWith);
    }
}
String.prototype.endWith = function (str) {
    if (str == null || str == "" || this.length == 0
        || str.length > this.length)
        return false;
    if (this.substring(this.length - str.length) == str)
        return true;
    else
        return false;
    return true;
}
String.prototype.startWith = function (str) {
    if (str == null || str == "" || this.length == 0
        || str.length > this.length)
        return false;
    if (this.substr(0, str.length) == str)
        return true;
    else
        return false;
    return true;
}
Array.prototype.removeByValue = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) {
            this.splice(i, 1);
            break;
        }
    }
}
/**
 * //使用方法 var now = new Date(); var nowStr = now.format("yyyy-MM-dd hh:mm:ss");
 * //使用方法2: var testDate = new Date(); var testStr =
 * testDate.format("YYYY年MM月dd日hh小时mm分ss秒"); alert(testStr);
 *
 * @param format
 * @returns
 */
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, // month
        "d+": this.getDate(), // day
        "h+": this.getHours(), // hour
        "m+": this.getMinutes(), // minute
        "s+": this.getSeconds(), // second
        "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
        "S": this.getMilliseconds()
        // millisecond
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "")
            .substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}
