/**
 * Copyright &copy; 2018 <a href="https://github.com/somewhereMrli/albedo-boot">albedo-boot</a> All rights reserved.
 */
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CTX } from "../../../../../app.constants";
import { ActivatedRoute } from "@angular/router";
import { TestBook } from "./testBook.model";
import { TestBookService } from "./testBook.service";
import { PublicService } from "../../../../../shared/base/service/public.service";

@Component({
    selector: ".test-testBook-form.page-form",
    templateUrl: "./testBook.form.component.html"
})
export class TestBookFormComponent implements AfterViewInit {

    testBook: TestBook;
    routeData: any;
    ctx: any;
    id: any;

    private afterViewInit = false;
    private afterLoad = false;
    constructor(
        private activatedRoute: ActivatedRoute,
        private testBookService: TestBookService,
        private publicService: PublicService) {
        this.ctx = publicService.getServiceCtx('test_testBook')
        this.testBook = new TestBook();
        this.routeData = this.activatedRoute.params.subscribe((params) => {
            this.id = params['id'];
            if (this.id) {
                this.testBookService.find(this.id).subscribe((data) => {
                    this.testBook = data;
                    albedoForm.setData("#testBook-save-form", this.testBook);
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

        var testBookId = this.testBook.id, thisCtx = this.ctx
        albedoForm.initValidate($("#testBook-save-form"), {
            // define validation rules
            rules: {
                email: { remote: thisCtx + '/test/testBook/checkByProperty?id=' + testBookId },
            },
            messages: {
                email: { remote: '邮箱已存在' },
            }
        })
        albedoForm.init();
        albedoForm.initSave();

    }



}
