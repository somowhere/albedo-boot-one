import { AfterViewInit, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core'
import { ScriptLoaderService } from "../../../../../shared/base/service/script-loader.service"
import { CTX, DATA_STATUS, DICT_SYS_DATA } from "../../../../../app.constants"
import { ActivatedRoute } from "@angular/router"
import { Principal } from "../../../../../auth/_services/principal.service"
import { PublicService } from "../../../../../shared/base/service/public.service";

declare let datatable: any
@Component({
    selector: ".sys-role-list.page-list",
    templateUrl: "./role.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class RoleComponent implements AfterViewInit {


    ctx: any
    constructor(
        private _script: ScriptLoaderService,
        private principal: Principal,
        private publicService: PublicService) {
        this.ctx = publicService.getServiceCtx('sys_role')

    }

    ngAfterViewInit() {
        this.initTable()
    }

    initTable() {
        var thisPrincipal = this.principal, thisCtx = this.ctx;
        var options = {
            data: {
                source: {
                    read: {
                        // sample GET method
                        method: 'GET',
                        url: thisCtx + '/sys/role/',
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
                    field: 'name',
                    title: '名称',
                    sortable: 'asc',
                    width: 150,
                    // basic templating support for column rendering,
                    // template: '{{OrderID}} - {{ShipCountry}}',
                }, {
                    field: 'sysData',
                    title: '是否系统数据',
                    width: 150,
                    template: function(row) {
                        return '<span class="m-badge ' + DICT_SYS_DATA[row.sysData].class + ' m-badge--wide">' + row.sysData + '</span>'
                    },
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
        if (thisPrincipal.hasAnyAuthorityDirect(["sys_role_edit", "sys_role_lock", "sys_role_delete"])) {
            options.columns.push({
                field: 'Actions',
                width: 110,
                title: '操作',
                sortable: false,
                template: function(row) {

                    var template = ''
                    if (thisPrincipal.hasAnyAuthorityDirectOne("sys_role_edit"))
                        template += '<a href="#/sys/role/form/' + row.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="编辑">\
                                \<i class="la la-edit"></i>\
                                \</a>'
                    if (thisPrincipal.hasAnyAuthorityDirectOne("sys_role_lock"))
                        template += '<a href="javascript:void(0)" class="m-portlet__nav-link btn m-btn m-btn--hover-warning m-btn--icon m-btn--icon-only m-btn--pill confirm" title="' + (row.status == "正常" ? "锁定" : "解锁") + '角色"\
						 data-table-id="#data-table-role" data-method="put"  data-title="你确认要操作【' + row.name + '】角色吗？" data-url="' + thisCtx + '/sys/role/' + row.id + '">\
                                \<i class="la la-'+ (row.status == "正常" ? "unlock-alt" : "unlock") + '"></i>\
                                \</a>'
                    if (thisPrincipal.hasAnyAuthorityDirectOne("sys_role_delete"))
                        template += '<a  href="javascript:void(0)" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill confirm" title="删除"\
                                   data-table-id="#data-table-role" data-method="delete"  data-title="你确认要删除【' + row.name + '】角色吗？" data-url="' + thisCtx + '/sys/role/' + row.id + '">\
                                \<i class="la la-trash"></i>\
                                \</a>'
                    return template
                },
            })
        }
        albedoList.initTable($('#data-table-role'), $('#role-search-form'), options)
        albedoList.init()
    }



}
