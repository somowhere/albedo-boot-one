import { AfterViewInit, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core'
import { ScriptLoaderService } from "../../../../../shared/base/service/script-loader.service"
import { CTX, DATA_STATUS } from "../../../../../app.constants"
import { ActivatedRoute } from "@angular/router"
import { Principal } from "../../../../../auth/_services/principal.service"
import { SessionStorageService } from "ngx-webstorage"
import { PublicService } from "../../../../../shared/base/service/public.service";

declare let datatable: any
@Component({
    selector: ".sys-module-list.page-list",
    templateUrl: "./module.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class ModuleComponent implements AfterViewInit {


    ctx: any
    routerSub: any
    nodeId: any
    constructor(
        private _script: ScriptLoaderService,
        private sessionStorage: SessionStorageService,
        private principal: Principal,
        private publicService: PublicService) {
        this.ctx = publicService.getServiceCtx('sys_module')
        this.nodeId = sessionStorage.retrieve("tree_module_select_node_id"), this.nodeId = (this.nodeId) ? this.nodeId : 1
    }


    ngAfterViewInit() {
        this.initTable()
    }

    initTable() {
        var thisPrincipal = this.principal, thisCtx = this.ctx
        var options = {
            data: {
                source: {
                    read: {
                        // sample GET method
                        method: 'GET',
                        url: thisCtx + '/sys/module/',
                    },
                },
                pageSize: 10,
            },
            // columns definition
            columns: [{
                field: 'iconCls',
                title: '图标',
                width: 40,
                // callback function support for column rendering
                template: function(row) {
                    return '<i class="fa ' + row.iconCls + '"></i>'
                }
            }, {
                field: 'name',
                title: '名称'
            }, {
                field: 'type',
                title: '类型',
            }, {
                field: 'permission',
                title: '权限',
            }, {
                field: 'requestMethod',
                title: '请求方法',
            }, {
                field: 'url',
                title: '链接',
            }, {
                field: 'sort',
                title: '序号',
                sortable: 'asc'
            }, {
                field: 'status',
                title: '状态',
                // callback function support for column rendering
                template: function(row) {
                    return '<span class="m-badge ' + DATA_STATUS[row.status].class + ' m-badge--wide">' + row.status + '</span>'
                },
            }, {
                field: 'lastModifiedDate',
                title: '修改时间',
            }],
        }
        if (thisPrincipal.hasAnyAuthorityDirect(["sys_module_edit", "sys_module_lock", "sys_module_delete"])) {
            options.columns.push({
                field: 'Actions',
                width: 110,
                title: '操作',
                sortable: false,
                template: function(row) {
                    var template = ''
                    if (thisPrincipal.hasAnyAuthorityDirectOne("sys_module_edit"))
                        template += '<a href="#/sys/module/form/' + row.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="编辑">\
                                \<i class="la la-edit"></i>\
                                \</a>'
                    if (thisPrincipal.hasAnyAuthorityDirectOne("sys_module_lock"))
                        template += '<a href="javascript:void(0)" class="m-portlet__nav-link btn m-btn m-btn--hover-warning m-btn--icon m-btn--icon-only m-btn--pill confirm" title="' + (row.status == "正常" ? "锁定" : "解锁") + '模块"\
						 data-table-id="#data-table-module" data-method="put"  data-title="你确认要操作【' + row.name + '】模块吗？" data-url="' + thisCtx + '/sys/module/' + row.id + '">\
                                \<i class="la la-'+ (row.status == "正常" ? "unlock-alt" : "unlock") + '"></i>\
                                \</a>'
                    if (thisPrincipal.hasAnyAuthorityDirectOne("sys_module_delete"))
                        template += '<a  href="javascript:void(0)" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill confirm" title="删除"\
                                   data-table-id="#data-table-module" data-method="delete"  data-title="你确认要删除【' + row.name + '】模块吗？" data-url="' + thisCtx + '/sys/module/' + row.id + '">\
                                \<i class="la la-trash"></i>\
                                \</a>'
                    return template
                },
            })
        }
        albedoList.initTable($('#data-table-module'), $('#module-search-form'), options)
        albedoList.init()
        albedoForm.initTree()
    }

    cancelClickNodeModule(treeId, treeNode) {
        // console.log(event)
        albedo.getSessionStorage().store("tree_module_select_node_id", '')
        $("#parentId").val('')
        $(".filter-submit-table-module").trigger("click")
    }
    clickTreeNodeModule(event, treeId, treeNode) {
        // console.log(event)
        var addUrl = $("#add-module").attr("data-url-temp")
        if (addUrl) $("#add-module").attr("data-url", addUrl + (addUrl.indexOf("?") == -1 ? "?" : "&") + "parentId=" + treeNode.id)
        this.nodeId = treeNode.id
        albedo.getSessionStorage().store("tree_module_select_node_id", this.nodeId)
        $("#parentId").val(treeNode.id)
        $(".filter-submit-table-module").trigger("click")
    }

}
