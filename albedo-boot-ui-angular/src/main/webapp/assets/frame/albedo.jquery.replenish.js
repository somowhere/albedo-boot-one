(function ($) {
    // $(document).ajaxSend(function (event, jqxhr, settings) {
    //     // $.blockUI({
    //     //     animate: true,
    //     //     overlayColor: 'none'
    //     // });
    //     mApp.blockPage({
    //         overlayColor: '#000000',
    //         state: 'primary'
    //     });
    //     var token = 'Bearer' + albedo.getToken();
    //     console.log(token)
    //     settings.header = {"Authorization": token};
    //     jqxhr.setRequestHeader("Authorization", token);
    // });
    // $(document).ajaxComplete(function (event, xhr, settings) {
    //     console.log("ajaxComplete")
    //     mApp.unblockPage();
    // });
    // $(document).ajaxSuccess(function (event, xhr, settings) {
    //     console.log("ajaxSuccess")
    //     mApp.unblockPage();
    // });
    // $(document).ajaxError(function (event, xhr, settings) {
    //     if(xhr.status == 'undefined'){
    //         return;
    //     }
    //     var msg;
    //     switch(xhr.status){
    //         case 403:
    //             msg ="系统拒绝：您没有访问权限。";
    //             break;
    //         case 404:
    //             msg ="您访问的资源不存在。";
    //             break;
    //         default:
    //             msg = '网络异常，请检查您的网络连接！';
    //     }
    //     try {
    //         toastr && toastr.error(msg, {closeButton: true, positionClass: 'toast-bottom-right'})
    //     } catch (e) {
    //     }
    // });
    //首先备份下jquery的ajax方法
    var _ajax=$.ajax;
    //重写jquery的ajax方法
    $.ajax=function(opt){
        //备份opt中error和success方法
        var fn = {
            error:function(XMLHttpRequest, textStatus, errorThrown){
                console&& console.log(errorThrown)
                if(textStatus == 'undefined'){
                    return;
                }
                var msg;
                switch(textStatus){
                    case 403:
                        msg ="系统拒绝：您没有访问权限。";
                        break;
                    case 404:
                        msg ="您访问的资源不存在。";
                        break;
                    default:
                        msg = '网络异常，请检查您的网络连接！';
                }
                try {
                    toastr && toastr.error(msg, {closeButton: true, positionClass: 'toast-bottom-right'})
                } catch (e) {
                }
            },
            success:function(data, textStatus){
                console.log(data)
            }
        }
        if(opt.error){
            fn.error=opt.error;
        }
        if(opt.success){
            fn.success=opt.success;
        }

        //扩展增强处理
        var _opt = $.extend(opt,{
            error:function(XMLHttpRequest, textStatus, errorThrown){
                mApp.unblockPage();
                //错误方法增强处理
                fn.error(XMLHttpRequest, textStatus, errorThrown);
            },
            success:function(data, textStatus){
                mApp.unblockPage();
                //成功回调方法增强处理
                fn.success(data, textStatus);
            },
            beforeSend:function(jqxhr){
                mApp.blockPage({
                    overlayColor: '#000000',
                    state: 'primary'
                });
                var token = 'Bearer ' + albedo.getToken();
                // console.log(token)
                // settings.header = {"Authorization": token};
                jqxhr.setRequestHeader("Authorization", token);
            },
            complete:function(XHR, TS){
                //请求完成后回调函数 (请求成功或失败之后均调用)。
                mApp.unblockPage();
            }
        });
        return _ajax(_opt);
    };


})(jQuery);



(function($){
    $.fn.mTreeInit = function($target, setting, data){
        /*obj, zSetting, zNodes*/
        return $.fn.zTree.init($target, setting, data);
    }

    $.fn.mTreeObj = function(treeId){
        /*treeId*/
        return $.fn.zTree.getZTreeObj(treeId);
    }
})(jQuery)
