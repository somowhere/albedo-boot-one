/**
 * Copyright &copy; 2018 <a href="https://github.com/somewhereMrli/albedo-boot">albedo-boot</a> All rights reserved.
 */
import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core'
import { ScriptLoaderService } from "../../../../../shared/base/service/script-loader.service"
import { CTX, DATA_STATUS } from "../../../../../app.constants"
import { Principal } from "../../../../../auth/_services/principal.service"
import { SessionStorageService } from "ngx-webstorage"
import { Area } from "./area.model"
import { PublicService } from "../../../../../shared/base/service/public.service";

declare let datatable: any
@Component({
    selector: ".sys-area-list.page-list",
    templateUrl: "./area.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class AreaComponent implements AfterViewInit {

    nodeId: any
    ctx: any
    area: Area
    constructor(
        private _script: ScriptLoaderService,
        private principal: Principal,
        private sessionStorage: SessionStorageService,
        private publicService: PublicService) {
        this.ctx = publicService.getServiceCtx('sys_area')
        this.area = new Area()
        this.nodeId = sessionStorage.retrieve("tree_area_select_node_id"), this.nodeId = (this.nodeId) ? this.nodeId : 1

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
                        url: thisCtx + '/sys/area/',
                    },
                },
                pageSize: 10,
            },
            // columns definition
            columns: [
                {
                    title: '区域名称', field: 'name'
                    , width: 110, sortable: 'asc', overflow: 'visible', template: function(row) {
                        return thisPrincipal.hasAnyAuthorityDirectOne("sys_area_edit") ? ('<a  href="javascript:void(0)" class="m-link dialog-edit" title="点击编辑"\
                            \data-method="get"  data-title="编辑【' + row.name + '】" data-url="' + thisCtx + '/sys/area/' + row.id + '" data-modal-id="#area-edit-modal" >' + row.name + '</a>') : row.name;
                    },
                },
                {
                    title: '区域简称', field: 'shortName'
                },
                {
                    title: '序号', field: 'sort'
                },
                {
                    title: '区域等级', field: 'level'
                },
                {
                    title: '区域编码', field: 'code'
                },
                {
                    title: '叶子节点', field: 'isLeaf'
                },
            ],
        }
        if (thisPrincipal.hasAnyAuthorityDirect(["sys_area_edit", "sys_area_lock", "sys_area_delete"])) {
            options.columns.push({
                field: 'Actions',
                width: 110,
                title: '操作',
                sortable: false,
                overflow: 'visible',
                template: function(row) {
                    var template = '';
                    if (thisPrincipal.hasAnyAuthorityDirectOne("sys_area_edit"))
                        template += '<a href="javascript:void(0)" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill dialog-edit" title="编辑"\
                            \data-method="get"  data-title="编辑【' + row.name + '】" data-url="' + thisCtx + '/sys/area/' + row.id + '" data-modal-id="#area-edit-modal">\
                            \<i class="la la-edit"></i>\
                            \</a>'
                    if (thisPrincipal.hasAnyAuthorityDirectOne("sys_area_lock"))
                        template += '<a href="javascript:void(0)" class="m-portlet__nav-link btn m-btn m-btn--hover-warning m-btn--icon m-btn--icon-only m-btn--pill confirm" title="' + (row.status == "正常" ? "锁定" : "解锁") + '区域"\
                     data-table-id="#data-table-area" data-method="put"  data-title="你确认要操作选中的区域吗？" data-url="' + thisCtx + '/sys/area/' + row.id + '">\
                            \<i class="la la-'+ (row.status == "正常" ? "unlock-alt" : "unlock") + '"></i>\
                            \</a>';
                    if (thisPrincipal.hasAnyAuthorityDirectOne("sys_area_delete"))
                        template += '<a  href="javascript:void(0)" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill confirm" title="删除"\
                               data-table-id="#data-table-area" data-method="delete"  data-title="你确认要删除选中的区域吗？" data-url="' + thisCtx + '/sys/area/' + row.id + '">\
                            \<i class="la la-trash"></i>\
                            \</a>';
                    return template;
                },
            })
        }
        albedoList.initTable($('#data-table-area'), $('#area-search-form'), options)
        albedoList.init()


        albedoForm.init()

        albedoForm.initValidate($("#area-save-form"), {
            // define validation rules
            rules: {
                code: { remote: thisCtx + '/sys/area/checkByProperty?id=' + encodeURIComponent(albedo.toStr($("#area-save-form").find("input[name='id']").val())) },
            },
            messages: {
                code: { remote: '区域编码已存在' },
            }
        })
        albedoForm.initSave($("#area-edit-modal"));
    }

    cancelClickNodeArea(event, treeId, treeNode) {
        albedo.getSessionStorage().store("tree_area_select_node_id", '')
        $("#parentId").val('')
        $(".filter-submit-table-area").trigger("click")
    }
    clickTreeNodeArea(event, treeId, treeNode) {
        var addUrl = $("#add-area").attr("data-url-temp")
        if (addUrl) $("#add-area").attr("data-url", addUrl + (addUrl.indexOf("?") == -1 ? "?" : "&") + "parentId=" + treeNode.id)
        this.nodeId = treeNode.id
        albedo.getSessionStorage().store("tree_area_select_node_id", this.nodeId)
        $("#parentId").val(treeNode.id)
        $(".filter-submit-table-area").trigger("click")
    }

}
