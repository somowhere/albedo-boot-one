/**
 * Copyright &copy; 2018 <a href="https://github.com/somewhereMrli/albedo-boot">albedo-boot</a> All rights reserved.
 */
import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core'
import { ScriptLoaderService } from "../../../../../shared/base/service/script-loader.service"
import { CTX, DATA_STATUS } from "../../../../../app.constants"
import { Principal } from "../../../../../auth/_services/principal.service"
import { SessionStorageService } from "ngx-webstorage"
import { TestTree } from "./testTree.model"
import { PublicService } from "../../../../../shared/base/service/public.service"

declare let datatable: any
@Component({
    selector: ".sys-testTree-list.page-list",
    templateUrl: "./testTree.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class TestTreeComponent implements AfterViewInit {

    nodeId: any
    ctx: any
    constructor(
        private _script: ScriptLoaderService,
        private principal: Principal,
        private sessionStorage: SessionStorageService,
        private publicService: PublicService) {
        this.ctx = publicService.getServiceCtx('test_testTree')

        this.nodeId = sessionStorage.retrieve("tree_testTree_select_node_id"), this.nodeId = (this.nodeId) ? this.nodeId : 1

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
                        method: 'GET',
                        url: thisCtx + '/test/testTree/',
                    },
                },
                pageSize: 10,
            },
            // columns definition
            columns: [
                {
                    title: 'name_', field: 'name'
                    , width: 110, sortable: 'asc', overflow: 'visible', template: function(row) {
                        return thisPrincipal.hasAnyAuthorityDirectOne("test_testTree_edit") ? ('<a href="#/test/testTree/form/' + row.id + '" class="m-link" title="点击编辑测试树管理">' + row.name + '</a>') : row.name;
                    },
                },
                {
                    title: '机构编码', field: 'code'
                },
                {
                    title: '机构等级', field: 'grade'
                },
                {                    
title: '节点类型', field: 'isLeaf'
                },
                {
                    title: '英文', field: 'en'
                },
                {                    
title: '序号', field: 'sort'
                },
                {
                    title: '组织类型', field: 'type'
                },
                {
                    title: 'status_', field: 'status', template: function(row) {
                        return '<span class="m-badge ' + DATA_STATUS[row.status].class + ' m-badge--wide">' + row.status + '</span>';
                    }
                },
                {
                    title: '默认日期', field: 'defaultData'
                },
            ],
        }
        if (thisPrincipal.hasAnyAuthorityDirect(["test_testTree_edit", "test_testTree_lock", "test_testTree_delete"])) {
            options.columns.push({
                field: 'Actions',
                width: 110,
                title: '操作',
                sortable: false,
                overflow: 'visible',
                template: function(row) {
                    var template = '';
                    if (thisPrincipal.hasAnyAuthorityDirectOne("test_testTree_edit"))
                        template += '<a href="#/test/testTree/form/' + row.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="编辑">\
                            \<i class="la la-edit"></i>\
                            \</a>';
                    if (thisPrincipal.hasAnyAuthorityDirectOne("test_testTree_lock"))
                        template += '<a href="javascript:void(0)" class="m-portlet__nav-link btn m-btn m-btn--hover-warning m-btn--icon m-btn--icon-only m-btn--pill confirm" title="' + (row.status == "正常" ? "锁定" : "解锁") + '测试树管理"\
                     data-table-id="#data-table-testTree" data-method="put"  data-title="你确认要操作选中的测试树管理吗？" data-url="' + thisCtx + '/test/testTree/' + row.id + '">\
                            \<i class="la la-'+ (row.status == "正常" ? "unlock-alt" : "unlock") + '"></i>\
                            \</a>';
                    if (thisPrincipal.hasAnyAuthorityDirectOne("test_testTree_delete"))
                        template += '<a  href="javascript:void(0)" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill confirm" title="删除"\
                               data-table-id="#data-table-testTree" data-method="delete"  data-title="你确认要删除选中的测试树管理吗？" data-url="' + thisCtx + '/test/testTree/' + row.id + '">\
                            \<i class="la la-trash"></i>\
                            \</a>';
                    return template;
                },
            })
        }
        albedoList.initTable($('#data-table-testTree'), $('#testTree-search-form'), options)
        albedoList.init()


        albedoForm.init()

    }

    cancelClickNodeTestTree(event, treeId, treeNode) {
        // console.log(event)
        albedo.getSessionStorage().store("tree_testTree_select_node_id", '')
        $("#parentId").val('')
        $(".filter-submit-table-testTree").trigger("click")
    }
    clickTreeNodeTestTree(event, treeId, treeNode) {
        // console.log(event)
        var addUrl = $("#add-testTree").attr("data-url-temp")
        if (addUrl) $("#add-testTree").attr("data-url", addUrl + (addUrl.indexOf("?") == -1 ? "?" : "&") + "parentId=" + treeNode.id)
        this.nodeId = treeNode.id
        albedo.getSessionStorage().store("tree_testTree_select_node_id", this.nodeId)
        $("#parentId").val(treeNode.id)
        $(".filter-submit-table-testTree").trigger("click")
    }

}
