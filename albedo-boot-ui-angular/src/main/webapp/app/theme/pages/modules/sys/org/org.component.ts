import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core'
import { ScriptLoaderService } from "../../../../../shared/base/service/script-loader.service"
import { CTX, DATA_STATUS } from "../../../../../app.constants"
import { Principal } from "../../../../../auth/_services/principal.service"
import { SessionStorageService } from "ngx-webstorage"
import { Org } from "./org.model"
import { PublicService } from "../../../../../shared/base/service/public.service";

declare let datatable: any
@Component({
    selector: ".sys-org-list.page-list",
    templateUrl: "./org.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class OrgComponent implements AfterViewInit {


    ctx: any
    nodeId: any
    org: Org
    constructor(
        private _script: ScriptLoaderService,
        private principal: Principal,
        private sessionStorage: SessionStorageService,
        private publicService: PublicService) {
        this.ctx = publicService.getServiceCtx('sys_org')
        this.org = new Org()
        this.nodeId = sessionStorage.retrieve("tree_org_select_node_id"), this.nodeId = (this.nodeId) ? this.nodeId : 1

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
                        url: thisCtx + '/sys/org/',
                    },
                },
                pageSize: 10,
            },
            // columns definition
            columns: [
                {
                    field: 'name',
                    title: '名称',
                    width: 110,
                    sortable: 'asc',
                }, {
                    field: 'code',
                    title: '编码',
                }, {
                    field: 'type',
                    title: '类型',
                }, {
                    field: 'grade',
                    title: '等级',
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
                },],
        }
        if (thisPrincipal.hasAnyAuthorityDirect(["sys_org_edit", "sys_org_lock", "sys_org_delete"])) {
            options.columns.push({
                field: 'Actions',
                width: 110,
                title: '操作',
                sortable: false,
                template: function(row) {
                    var template = ''

                    if (thisPrincipal.hasAnyAuthorityDirectOne("sys_org_edit"))
                        template += '<a href="javascript:void(0)" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill dialog-edit" title="编辑"\
                                \data-method="get"  data-title="编辑【' + row.name + '】机构" data-url="' + thisCtx + '/sys/org/' + row.id + '" data-modal-id="#org-edit-modal">\
                                \<i class="la la-edit"></i>\
                                \</a>'
                    if (thisPrincipal.hasAnyAuthorityDirectOne("sys_org_lock"))
                        template += '<a href="javascript:void(0)" class="m-portlet__nav-link btn m-btn m-btn--hover-warning m-btn--icon m-btn--icon-only m-btn--pill confirm" title="' + (row.status == "正常" ? "锁定" : "解锁") + '机构"\
						    data-table-id="#data-table-org" data-method="put"  data-title="你确认要操作【' + row.name + '】机构吗？" data-url="' + thisCtx + '/sys/org/' + row.id + '">\
                                \<i class="la la-'+ (row.status == "正常" ? "unlock-alt" : "unlock") + '"></i>\
                                \</a>'
                    if (thisPrincipal.hasAnyAuthorityDirectOne("sys_org_delete"))
                        template += '<a  href="javascript:void(0)" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill confirm" title="删除"\
                                   data-table-id="#data-table-org" data-method="delete"  data-title="你确认要删除【' + row.name + '】机构吗？" data-url="' + thisCtx + '/sys/org/' + row.id + '">\
                                \<i class="la la-trash"></i>\
                                \</a>'
                    return template
                },
            })
        }
        albedoList.initTable($('#data-table-org'), $('#org-search-form'), options)
        albedoList.init()


        albedoForm.init()

        albedoForm.initValidate($("#org-save-form"), {
            // define validation rules
            rules: {
                name: { remote: thisCtx + '/sys/org/checkByProperty?_statusFalse&id=' + encodeURIComponent(albedo.toStr($("#org-save-form").find("input[name='id']").val())) },
                code: { remote: thisCtx + '/sys/org/checkByProperty?_statusFalse&id=' + encodeURIComponent(albedo.toStr($("#org-save-form").find("input[name='id']").val())) },
            },
            messages: {
                name: { message: '机构已存在' },
                code: { message: '编码已存在' },
            },
        })
        albedoForm.initSave($("#org-edit-modal"))
    }

    cancelClickNodeOrg(event, treeId, treeNode) {
        // console.log(event)
        albedo.getSessionStorage().store("tree_org_select_node_id", '')
        $("#parentId").val('')
        $(".filter-submit-table-org").trigger("click")
    }
    clickTreeNodeOrg(event, treeId, treeNode) {
        // console.log(event)
        var addUrl = $("#add-org").attr("data-url-temp")
        if (addUrl) $("#add-org").attr("data-url", addUrl + (addUrl.indexOf("?") == -1 ? "?" : "&") + "parentId=" + treeNode.id)
        this.nodeId = treeNode.id
        albedo.getSessionStorage().store("tree_org_select_node_id", this.nodeId)
        $("#parentId").val(treeNode.id)
        $(".filter-submit-table-org").trigger("click")
    }

}
