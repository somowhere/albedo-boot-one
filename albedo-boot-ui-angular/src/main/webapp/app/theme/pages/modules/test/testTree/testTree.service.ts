/**
 * Copyright &copy; 2018 <a href="https://github.com/somewhereMrli/albedo-boot">albedo-boot</a> All rights reserved.
 */
import { Injectable } from '@angular/core'
import { HttpClient } from "@angular/common/http"
import { TreeService } from "../../../../../shared/base/service/tree.service"
import { PublicService } from "../../../../../shared/base/service/public.service"
import { TestTree } from "./testTree.model"


@Injectable()
export class TestTreeService extends TreeService<TestTree> {

    constructor(
        protected http: HttpClient,
        protected publicService: PublicService) {
        super(http, publicService.getServiceCtx('test_testTree') + '/test/testTree')
    }

}
