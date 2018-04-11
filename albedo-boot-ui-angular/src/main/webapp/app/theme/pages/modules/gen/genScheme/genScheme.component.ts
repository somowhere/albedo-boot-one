import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core'
import { ScriptLoaderService } from "../../../../../shared/base/service/script-loader.service"
import { CTX, DATA_STATUS } from "../../../../../app.constants"
import { Principal } from "../../../../../auth/_services/principal.service"
import { GenSchemeService } from "./genScheme.service"
import { Router } from "@angular/router"
import { PublicService } from "../../../../../shared/base/service/public.service";

declare let datatable: any
@Component({
    selector: ".sys-genScheme-list.page-list",
    templateUrl: "./genScheme.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class GenSchemeComponent implements AfterViewInit {


    ctx: any

    constructor(
        private _script: ScriptLoaderService,
        private genSchemeService: GenSchemeService,
        private principal: Principal,
        private router: Router,
        private publicService: PublicService) {
        this.ctx = publicService.getServiceCtx('gen_genScheme')
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
                        url: thisCtx + '/gen/genScheme/',
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
                    textAlign: 'center',
                },
                {
                    field: 'genTableName',
                    title: '表名',
                }, {
                    field: 'packageName',
                    title: '基础包名',
                }, {
                    field: 'moduleName',
                    title: '模块',
                }, {
                    field: 'functionName',
                    title: '功能名称',
                }, {
                    field: 'functionAuthor',
                    title: '功能作者',
                }, {
                    field: 'status',
                    title: '状态',
                    template: function(row) {
                        return '<span class="m-badge ' + DATA_STATUS[row.status].class + ' m-badge--wide">' + row.status + '</span>'
                    },
                }, {
                    field: 'lastModifiedDate',
                    title: '修改时间',
                },],
        }
        if (thisPrincipal.hasAnyAuthorityDirect(["gen_genScheme_edit", "gen_genScheme_lock", "gen_genScheme_delete"])) {
            options.columns.push({
                field: 'Actions',
                width: 110,
                title: '操作',
                sortable: false,
                template: function(row) {
                    var template = ''
                    if (thisPrincipal.hasAnyAuthorityDirectOne("gen_genScheme_edit"))
                        template += '<a href="#/gen/genScheme/form/' + row.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="编辑">\
                                \<i class="la la-edit"></i>\
                                \</a>'
                    if (thisPrincipal.hasAnyAuthorityDirectOne("gen_genScheme_lock"))
                        template += '<a href="javascript:void(0)" class="m-portlet__nav-link btn m-btn m-btn--hover-warning m-btn--icon m-btn--icon-only m-btn--pill confirm" title="' + (row.status == "正常" ? "锁定" : "解锁") + '方案配置"\
						 data-table-id="#data-table-genScheme" data-method="put"  data-title="你确认要操作【' + row.name + '】方案配置吗？" data-url="' + thisCtx + '/gen/genScheme/' + row.id + '">\
                                \<i class="la la-'+ (row.status == "正常" ? "unlock-alt" : "unlock") + '"></i>\
                                \</a>'
                    if (thisPrincipal.hasAnyAuthorityDirectOne("gen_genScheme_delete"))
                        template += '<a  href="javascript:void(0)" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill confirm" title="删除"\
                                   data-table-id="#data-table-genScheme" data-method="delete"  data-title="你确认要删除【' + row.name + '】方案配置吗？" data-url="' + thisCtx + '/gen/genScheme/' + row.id + '">\
                                \<i class="la la-trash"></i>\
                                \</a>'
                    return template
                },
            })
        }
        albedoList.initTable($('#data-table-genScheme'), $('#genScheme-search-form'), options)
        albedoList.init()

    }

}
