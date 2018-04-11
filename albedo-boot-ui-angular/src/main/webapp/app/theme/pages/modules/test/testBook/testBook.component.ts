/**
 * Copyright &copy; 2018 <a href="https://github.com/somewhereMrli/albedo-boot">albedo-boot</a> All rights reserved.
 */
import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
import { ScriptLoaderService } from "../../../../../shared/base/service/script-loader.service";
import { DATA_STATUS } from "../../../../../app.constants";
import { ActivatedRoute } from "@angular/router";
import { Principal } from "../../../../../auth/_services/principal.service";
import { PublicService } from "../../../../../shared/base/service/public.service";
@Component({
    selector: ".test-testBook-list.page-list",
    templateUrl: "./testBook.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class TestBookComponent implements AfterViewInit {

    ctx: any
    constructor(
        private _script: ScriptLoaderService,
        private router: ActivatedRoute,
        private principal: Principal,
        private publicService: PublicService) {
        this.ctx = publicService.getServiceCtx('test_testBook')

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
                        url: thisCtx + '/test/testBook/',
                    },
                },
                pageSize: 10,
            },
            // columns definition
            columns: [
                {
                    title: '标题', field: 'title'
                    , width: 110, sortable: 'asc', overflow: 'visible', template: function(row) {
                        return thisPrincipal.hasAnyAuthorityDirectOne("test_testBook_edit") ? ('<a href="#/test/testBook/form/' + row.id + '" class="m-link" title="点击编辑测试书籍">' + row.title + '</a>') : row.title;

                    },
                },
                {
                    title: '作者', field: 'author'
                },
                {
                    title: '名称', field: 'name'
                },
                {
                    title: '邮箱', field: 'email'
                },
                {                    
title: '手机', field: 'phone'
                },
                {
                    title: 'activated_', field: 'activated'
                },
                {
                    title: 'key', field: 'langKey'
                },
                {
                    title: 'activation_key', field: 'activationKey'
                },
                {
                    title: 'reset_key', field: 'resetKey'
                },
                {
                    title: 'reset_date', field: 'resetDate'
                },
            ],
        };
        if (thisPrincipal.hasAnyAuthorityDirect(["test_testBook_edit", "test_testBook_lock", "test_testBook_delete"])) {
            options.columns.push({
                field: 'Actions',
                width: 110,
                title: '操作',
                sortable: false,
                overflow: 'visible',
                template: function(row) {
                    var template = '';
                    if (thisPrincipal.hasAnyAuthorityDirectOne("test_testBook_edit"))
                        template += '<a href="#/test/testBook/form/' + row.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="编辑">\
                            \<i class="la la-edit"></i>\
                            \</a>';
                    if (thisPrincipal.hasAnyAuthorityDirectOne("test_testBook_lock"))
                        template += '<a href="javascript:void(0)" class="m-portlet__nav-link btn m-btn m-btn--hover-warning m-btn--icon m-btn--icon-only m-btn--pill confirm" title="' + (row.status == "正常" ? "锁定" : "解锁") + '测试书籍"\
                     data-table-id="#data-table-testBook" data-method="put"  data-title="你确认要操作选中的测试书籍吗？" data-url="' + thisCtx + '/test/testBook/' + row.id + '">\
                            \<i class="la la-'+ (row.status == "正常" ? "unlock-alt" : "unlock") + '"></i>\
                            \</a>';
                    if (thisPrincipal.hasAnyAuthorityDirectOne("test_testBook_delete"))
                        template += '<a  href="javascript:void(0)" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill confirm" title="删除"\
                               data-table-id="#data-table-testBook" data-method="delete"  data-title="你确认要删除选中的测试书籍吗？" data-url="' + thisCtx + '/test/testBook/' + row.id + '">\
                            \<i class="la la-trash"></i>\
                            \</a>';
                    return template;
                },
            })
        }
        albedoList.initTable($('#data-table-testBook'), $('#testBook-search-form'), options);
        albedoList.init();
        albedoForm.init();
    }



}
