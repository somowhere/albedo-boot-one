
var albedoList = function(){
    var _mapData={};
    var _getData = function (key) {
        return _mapData ? _mapData[key] : null;
    }
    var _setData = function (key, data) {
        if(key)_mapData[key] = data;
    }
    var handleInitHtmlTable = function($table, options){
        var  $table = $table && $table.length>0 ? $table : $(document).find('.m_datatable');
        options = $.extend(true, {
            data: {
                saveState: {cookie: false},
            }}, options);
        setTimeout(function() {
            $table.each(function (index, item) {
                var dataTable = $(item).mDatatable(options);
                // console.log(dataTable);
                $(item).attr("id")&&_setData("#"+$(item).attr("id"), dataTable);
            })
        }, 100)
    }
    var handleInitTable = function($table, $formSearch, options){
        var  $table = $table && $table.length>0 ? $table : $(document).find('.m_datatable'),$formSearch = $formSearch && $formSearch.length>0 ? $formSearch : $(document).find('.search-form');
        options = $.extend(true, {// datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        map: function(raw) {
                            // sample data mapping
                            var dataSet = raw;
                            if (typeof raw.data !== 'undefined') {
                                dataSet = raw.data;
                            }
                            return dataSet;
                        },
                    },
                },
                pageSize: 10,
                saveState: {
                    cookie: true,
                    webstorage: true,
                },
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true,
            },
            formSearch: $formSearch,
            // layout definition
            layout: {
                theme: 'default', // datatable theme
                class: '', // custom wrapper class
                scroll: true, // enable/disable datatable scroll both horizontal and vertical when needed.
                footer: false // display/hide footer
            },

            // column sorting
            sortable: true,

            pagination: true,

            toolbar: {
                // toolbar items
                items: {
                    // pagination
                    pagination: {
                        // page size select
                        pageSizeSelect: [10, 20, 30, 50, 100],
                    },
                },
            }
        }, options);
        setTimeout(function() {
            $table.each(function (index, item) {
                var dataTable = $(item).mDatatable(options);
                // console.log(dataTable);
                $(item).attr("id")&&_setData("#"+$(item).attr("id"), dataTable);
                $formSearch.find(".search-form-btn").click(function() {
                    _getData("#"+$(item).attr("id")).loadFilterGird();
                })
            })

        }, 100)

    }
    var handleInitConfirm = function ($target) {
        var $target = $target && $target.length>0 || $(document);
        $target.off("click.confirm").on("click.confirm", "a.confirm", function () {
            var el = $(this);
            $(document).off("keydown");
            mApp.confirm({
                content: el.data("title") || "确认操作吗？",
                confirm: function ($modal) {
                    $.ajax({
                        url: el.attr("data-url"),
                        type: el.attr("data-method") || "POST",
                        dataType: "json",
                        timeout: 15000,
                        success: function (re) {
                            albedoForm.alertDialog($modal, re, el);
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            console.log(textStatus,errorThrown);
                            albedoForm.alertDialog($target, XMLHttpRequest.responseJSON, el);
                        }
                    });
                }
            });
        });
    }

    var handleInitTableAddModal = function ($target) {
        handleModal(function(el){
            var $targetForm = $(el.attr("data-modal-id")).find(".m-form");
            albedoForm.initFormData("#"+$targetForm.attr("id"), null)
            albedoForm.initValidate($targetForm)
        },".dialog-add", $target)
    }
    var handleInitTableEditModal = function ($target) {
        handleModal(function(el){
            $.ajax({
                url: el.attr("data-url"),
                type: el.attr("data-method") || "get",
                timeout: 15000,
                success: function (re) {
                    if(re && re.status == "1"){
                        var $targetForm = $(el.attr("data-modal-id")).find(".m-form");
                        albedoForm.initFormData("#"+$targetForm.attr("id"), re.data)
                        albedoForm.initValidate($targetForm)
                    }else{
                        var alertType = "warning", icon = "warning";
                        mApp.alert({
                            close: true,
                            focus: true,
                            type: alertType,
                            closeInSeconds: 8,
                            message: (re && re.message) ? re.message : '网络异常，请检查您的网络!',
                            icon: icon
                        });
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log(textStatus,errorThrown);
                    albedoForm.alertDialog($target, XMLHttpRequest.responseJSON, el);
                }
            });
        },".dialog-edit", $target)
    }
    var handleModal = function (callback, btn, $target) {
        var $target = $target && $target.length>0 || $(document);
        $target.off("click"+btn).on("click"+btn, btn, function (){
            var el = $(this);
            if(albedo.isExitsFunction(callback)){
                callback(el);
            }
            var $modal = $(el.attr("data-modal-id")), title = el.attr("data-title") ? el.attr("data-title") : el.attr("title");
            if(title)$modal.find("modal-title").text(title)
            $modal.modal();
        });
    }
    //* END:CORE HANDLERS *//

    return {
        getData: function(key){
            return _getData(key);
        },
        initHtmlTable: function($table, options){
            handleInitHtmlTable($table, options)
        },
        initTable: function($table, $formBtn, options){
            handleInitTable($table, $formBtn, options)
        },
        initConfirm: function ($target) {
            handleInitConfirm($target);
        },
        initModal: function (callback,btn) {
            handleModal(callback, btn);
        },
        //main function to initiate the theme
        init: function ($target) {
            handleInitConfirm($target);
            handleInitTableEditModal($target);
            handleInitTableAddModal($target);
        }
    }
}();
