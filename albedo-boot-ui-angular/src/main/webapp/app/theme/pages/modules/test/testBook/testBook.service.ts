/**
 * Copyright &copy; 2018 <a href="https://github.com/somewhereMrli/albedo-boot">albedo-boot</a> All rights reserved.
 */
import { Injectable } from '@angular/core'
import { HttpClient } from "@angular/common/http";
import { CTX } from "../../../../../app.constants"
import { DataService } from "../../../../../shared/base/service/data.service";
import { PublicService } from "../../../../../shared/base/service/public.service";
import { TestBook } from "./testBook.model";


@Injectable()
export class TestBookService extends DataService<TestBook> {

    constructor(
        protected http: HttpClient,
        protected publicService: PublicService) {
        super(http, publicService.getServiceCtx('test_testBook') + '/test/testBook')
    }

}
