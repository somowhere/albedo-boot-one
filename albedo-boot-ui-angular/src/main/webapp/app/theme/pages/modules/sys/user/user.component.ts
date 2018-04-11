import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core'
import { ScriptLoaderService } from "../../../../../shared/base/service/script-loader.service"
import { CTX, DATA_STATUS } from "../../../../../app.constants"
import { ActivatedRoute } from "@angular/router"
import { Principal } from "../../../../../auth/_services/principal.service"
import { PublicService } from "../../../../../shared/base/service/public.service";

declare let datatable: any
@Component({
    selector: ".sys-user-list.page-list",
    templateUrl: "./user.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class UserComponent implements AfterViewInit {


    ctx: any
    constructor(
        private _script: ScriptLoaderService,
        private router: ActivatedRoute,
        private principal: Principal,
        private publicService: PublicService) {
        this.ctx = publicService.getServiceCtx('sys_user')
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
                        url: this.ctx + '/sys/user/',
                    },
                },
                pageSize: 10,
            },
            // columns definition
            columns: [
                {
                    field: 'orgName',
                    title: '所属组织',
                    // width: 40,
                    textAlign: 'center',
                }, {
                    field: 'loginId',
                    title: '登录Id',
                    sortable: 'asc',
                    overflow: 'visible',
                    width: 150,
                    template: function(row) {
                        return thisPrincipal.hasAnyAuthorityDirectOne("sys_user_edit") ? ('<a href="#/sys/user/form/' + row.id + '" class="m-link" title="点击编辑">' + row.loginId + '</a>') : row.loginId
                    },
                }, {
                    field: 'email',
                    title: '邮箱',
                    width: 150,
                }, {
                    field: 'status',
                    title: '状态',
                    template: function(row) {
                        return '<span class="m-badge ' + DATA_STATUS[row.status].class + ' m-badge--wide">' + row.status + '</span>'
                    },
                }, {
                    field: 'lastModifiedDate',
                    title: '修改时间',
                }],
        }
        if (thisPrincipal.hasAnyAuthorityDirect(["sys_user_edit", "sys_user_lock", "sys_user_delete"])) {
            options.columns.push({
                field: 'Actions',
                width: 110,
                title: '操作',
                sortable: false,
                overflow: 'visible',
                template: function(row) {
                    var template = ''
                    if (thisPrincipal.hasAnyAuthorityDirectOne("sys_user_edit"))
                        template += '<a href="#/sys/user/form/' + row.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="编辑">\
                                \<i class="la la-edit"></i>\
                                \</a>'
                    if (thisPrincipal.hasAnyAuthorityDirectOne("sys_user_lock"))
                        template += '<a href="javascript:void(0)" class="m-portlet__nav-link btn m-btn m-btn--hover-warning m-btn--icon m-btn--icon-only m-btn--pill confirm" title="' + (row.status == "正常" ? "锁定" : "解锁") + '用户"\
						 data-table-id="#data-table-user" data-method="put"  data-title="你确认要操作【' + row.loginId + '】用户吗？" data-url="' + thisCtx + '/sys/user/' + row.id + '">\
                                \<i class="la la-'+ (row.status == "正常" ? "unlock-alt" : "unlock") + '"></i>\
                                \</a>'
                    if (thisPrincipal.hasAnyAuthorityDirectOne("sys_user_delete"))
                        template += '<a  href="javascript:void(0)" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill confirm" title="删除"\
                                   data-table-id="#data-table-user" data-method="delete"  data-title="你确认要删除【' + row.loginId + '】用户吗？" data-url="' + thisCtx + '/sys/user/' + row.id + '">\
                                \<i class="la la-trash"></i>\
                                \</a>'
                    return template
                },
            })
        }
        albedoList.initTable($('#data-table-user'), $('#user-search-form'), options)
        albedoList.init()
        albedoForm.init()
    }



}
