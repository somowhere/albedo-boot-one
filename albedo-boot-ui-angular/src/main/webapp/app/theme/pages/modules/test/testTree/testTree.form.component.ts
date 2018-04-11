/**
 * Copyright &copy; 2018 <a href="https://github.com/somewhereMrli/albedo-boot">albedo-boot</a> All rights reserved.
 */
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CTX } from "../../../../../app.constants";
import { ActivatedRoute } from "@angular/router";
import { TestTree } from "./testTree.model";
import { TestTreeService } from "./testTree.service";
import { PublicService } from "../../../../../shared/base/service/public.service"

@Component({
    selector: ".test-testTree-form.page-form",
    templateUrl: "./testTree.form.component.html"
})
export class TestTreeFormComponent implements AfterViewInit {

    testTree: TestTree;
    routeData: any;
    ctx: any;
    id: any;

    private afterViewInit = false;
    private afterLoad = false;
    constructor(
        private activatedRoute: ActivatedRoute,
        private testTreeService: TestTreeService,
        private publicService: PublicService) {
        this.ctx = publicService.getServiceCtx('test_testTree')
        this.testTree = new TestTree();
        this.routeData = this.activatedRoute.params.subscribe((params) => {
            this.id = params['id'];
            if (this.id) {
                this.testTreeService.find(this.id).subscribe((data) => {
                    this.testTree = data;
                    albedoForm.setData("#testTree-save-form", this.testTree);
                    this.afterLoad = true;
                    this.initForm();
                });
            } else {
                this.afterLoad = true;
                this.initForm();
            }
        });
    }


    ngAfterViewInit() {
        this.afterViewInit = true;
        this.initForm();
    }

    initForm() {
        if (!this.afterViewInit || !this.afterLoad) return;

        var testTreeId = this.testTree.id, thisCtx = this.ctx
        albedoForm.initValidate($("#testTree-save-form"), {
            // define validation rules
            rules: {
                name: { remote: thisCtx + '/test/testTree/checkByProperty?id=' + testTreeId },
            },
            messages: {
                name: { remote: 'name_已存在' },
            }
        })
        albedoForm.init();
        albedoForm.initSave();

    }



}
