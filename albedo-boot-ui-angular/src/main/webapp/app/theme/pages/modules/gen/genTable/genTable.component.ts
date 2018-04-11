import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core'
import { ScriptLoaderService } from "../../../../../shared/base/service/script-loader.service"
import { CTX, DATA_STATUS } from "../../../../../app.constants"
import { Principal } from "../../../../../auth/_services/principal.service"
import { GenTableService } from "./genTable.service"
import { Router } from "@angular/router"
import { PublicService } from "../../../../../shared/base/service/public.service";

declare let datatable: any
@Component({
    selector: ".sys-genTable-list.page-list",
    templateUrl: "./genTable.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class GenTableComponent implements AfterViewInit {


    ctx: any

    constructor(
        private _script: ScriptLoaderService,
        private genTableService: GenTableService,
        private principal: Principal,
        private router: Router,
        private publicService: PublicService) {
        this.ctx = publicService.getServiceCtx('gen_genTable')
    }
    ngAfterViewInit() {
        this.initTable()
        this.initAddGenTable()
    }

    initTable() {
        var thisPrincipal = this.principal, thisCtx = this.ctx
        var options = {
            data: {
                source: {
                    read: {
                        // sample GET method
                        method: 'GET',
                        url: thisCtx + '/gen/genTable/',
                    },
                },
                pageSize: 10,
            },
            // columns definition
            columns: [
                {
                    field: 'name',
                    title: '表名',
                    width: 110,
                    sortable: 'asc',
                    textAlign: 'center',
                }, {
                    field: 'comments',
                    title: '说明',
                }, {
                    field: 'className',
                    title: '类名',
                }, {
                    field: 'parentTable',
                    title: '父表名',
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
        if (thisPrincipal.hasAnyAuthorityDirect(["gen_genTable_edit", "gen_genTable_lock", "gen_genTable_delete"])) {
            options.columns.push({
                field: 'Actions',
                width: 110,
                title: '操作',
                sortable: false,
                template: function(row) {
                    var template = ''
                    if (thisPrincipal.hasAnyAuthorityDirectOne("gen_genTable_edit"))
                        template += '<a href="#/gen/genTable/form/' + row.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="编辑">\
                                \<i class="la la-edit"></i>\
                                \</a>'
                    if (thisPrincipal.hasAnyAuthorityDirectOne("gen_genTable_lock"))
                        template += '<a href="javascript:void(0)" class="m-portlet__nav-link btn m-btn m-btn--hover-warning m-btn--icon m-btn--icon-only m-btn--pill confirm" title="' + (row.status == "正常" ? "锁定" : "解锁") + '业务表"\
						 data-table-id="#data-table-genTable" data-method="put"  data-title="你确认要操作【' + row.name + '】业务表吗？" data-url="' + thisCtx + '/gen/genTable/' + row.id + '">\
                                \<i class="la la-'+ (row.status == "正常" ? "unlock-alt" : "unlock") + '"></i>\
                                \</a>'
                    if (thisPrincipal.hasAnyAuthorityDirectOne("gen_genTable_delete"))
                        template += '<a  href="javascript:void(0)" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill confirm" title="删除"\
                                   data-table-id="#data-table-genTable" data-method="delete"  data-title="你确认要删除【' + row.name + '】业务表吗？" data-url="' + thisCtx + '/gen/genTable/' + row.id + '">\
                                \<i class="la la-trash"></i>\
                                \</a>'
                    return template
                },
            })
        }
        albedoList.initTable($('#data-table-genTable'), $('#genTable-search-form'), options)
        albedoList.init()

        albedoForm.initValidate($("#genTable-form-before"))
        albedoForm.initSave()
    }

    initAddGenTable() {
        var thisRouter = this.router
        $(".btn-add-genTable").click(function() {
            $("#genTable-dialog-before").modal({ width: 740 }).find(".confirm-modal").off().click(function() {
                var $form = $("#genTable-form-before")
                if (albedoForm.validate($form)) {
                    thisRouter.navigate(['/gen/genTable/form'], { queryParams: $form.serializeObject($form) })
                    $("#genTable-dialog-before").modal('hide')
                }
            })
        })


    }

}
