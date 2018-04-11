import { Injectable } from '@angular/core'
import { Http } from '@angular/http'
import { Observable } from 'rxjs/Rx'
import { CTX } from "../../../../../app.constants"
import { DataService } from "../../../../../shared/base/service/data.service"
import { Module } from "./module.model"
import { createRequestOption } from "../../../../../shared/base/request.util";
import { HttpClient } from "@angular/common/http";
import { PublicService } from "../../../../../shared/base/service/public.service";
import { TreeService } from "../../../../../shared/base/service/tree.service";


@Injectable()
export class ModuleService extends TreeService<Module> {

    constructor(
        protected http: HttpClient,
        protected publicService: PublicService) {
        super(http, publicService.getServiceCtx('sys_module') + '/sys/module')
    }








}
