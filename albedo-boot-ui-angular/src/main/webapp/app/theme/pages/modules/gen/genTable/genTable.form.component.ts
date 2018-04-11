import { AfterViewInit, Component } from '@angular/core'
import { CTX } from "../../../../../app.constants"
import { ActivatedRoute } from "@angular/router"
import { GenTable } from "./genTable.model"
import { GenTableService } from "./genTable.service"
import { PublicService } from "../../../../../shared/base/service/public.service";

@Component({
    selector: ".sys-genTable-form.page-form",
    templateUrl: "./genTable.form.component.html"
})
export class GenTableFormComponent implements AfterViewInit {

    genTable: GenTable
    routeData: any
    ctx: any
    id: any
    javaTypeList
    queryTypeList
    showTypeList
    tableList
    columnList

    private afterViewInit = false
    private afterLoad = false
    constructor(
        private activatedRoute: ActivatedRoute,
        private genTableService: GenTableService,
        private publicService: PublicService) {
        this.ctx = publicService.getServiceCtx('gen_genTable')
        this.genTable = new GenTable()
        this.activatedRoute.queryParams.subscribe((params) => {
            params['name'] && this.initData(params)
        })
        this.activatedRoute.params.subscribe((params) => {
            params['id'] && this.initData(params)
        })
    }

    initData(params) {
        params && this.genTableService.formData(params).subscribe((data) => {
            if (data.genTableVo) this.genTable = data.genTableVo
            this.javaTypeList = data.javaTypeList
            this.queryTypeList = data.queryTypeList
            this.showTypeList = data.showTypeList
            console.log(data.tableList)
            this.tableList = data.tableList
            this.columnList = data.columnList
            albedoForm.setData("#genTable-save-form", data.genTableVo)

            this.afterLoad = true
            this.initForm()
        })
    }

    ngAfterViewInit() {
        this.afterViewInit = true
        this.initForm()
    }

    initForm() {
        if (!this.afterViewInit || !this.afterLoad) return

        var genTableId = this.genTable.id, thisCtx = this.ctx
        albedoForm.initValidate($("#genTable-save-form"), {
            // define validation rules
            rules: {
                name: { remote: thisCtx + '/gen/genTable/checkByProperty?_statusFalse&id=' + encodeURIComponent(genTableId) }
            },
            messages: {
                name: { message: '名称已存在' },
            },
        })
        albedoForm.init()
        albedoForm.initSave()


    }



}
