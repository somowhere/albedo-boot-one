import { AfterViewInit, Component } from '@angular/core'
import { CTX } from "../../../../../app.constants"
import { ActivatedRoute } from "@angular/router"
import { GenScheme } from "./genScheme.model"
import { GenSchemeService } from "./genScheme.service"
import { PublicService } from "../../../../../shared/base/service/public.service";

@Component({
    selector: ".sys-genScheme-form.page-form",
    templateUrl: "./genScheme.form.component.html"
})
export class GenSchemeFormComponent implements AfterViewInit {

    genScheme: GenScheme
    routeData: any
    ctx: any
    id: any
    viewTypeList
    categoryList
    tableList

    private afterViewInit = false
    private afterLoad = false
    constructor(
        private activatedRoute: ActivatedRoute,
        private genSchemeService: GenSchemeService,
        private publicService: PublicService) {
        this.ctx = publicService.getServiceCtx('gen_genScheme')
        this.genScheme = new GenScheme()
        this.routeData = this.activatedRoute.params.subscribe((params) => {
            this.genSchemeService.formData(params).subscribe((data) => {
                if (data.genSchemeVo) this.genScheme = data.genSchemeVo
                this.viewTypeList = data.viewTypeList
                this.categoryList = data.categoryList
                this.tableList = data.tableList
                albedoForm.setData("#genScheme-save-form", this.genScheme)
                this.afterLoad = true
                this.initForm()
            })

        })
    }

    ngAfterViewInit() {
        this.afterViewInit = true
        this.initForm()
        this.initFormSyncModule()
    }

    initForm() {
        if (!this.afterViewInit || !this.afterLoad) return

        var genSchemeId = this.genScheme.id, thisCtx = this.ctx
        albedoForm.initValidate($("#genScheme-save-form"), {
            // define validation rules
            rules: {
                loginId: { remote: CTX + '/gen/genScheme/checkByProperty?_statusFalse&id=' + encodeURIComponent(genSchemeId) },
                status: { required: true },
                roleIdList: { required: true },
            },
            messages: {
                loginId: { message: '登录Id已存在' },
            },
        })
        albedoForm.init()
        albedoForm.initSave()


    }

    initFormSyncModule() {
        $("#syncModule").off().click(function() {
            $(this).is(':checked') ? $("#parentModule_div").removeClass("hide").find("input#modularName").addClass("required") : $("#parentModule_div").addClass("hide").find("input#modularName").removeClass("required")
        })
    }

}
