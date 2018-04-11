import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Rx'
import { CTX } from "../../../../../app.constants";
import { Dict } from "./dict.model";
import { createRequestOption } from "../../../../../shared/base/request.util";
import { DataService } from "../../../../../shared/base/service/data.service";
import { HttpClient } from "@angular/common/http";
import { PublicService } from "../../../../../shared/base/service/public.service";
import { TreeService } from "../../../../../shared/base/service/tree.service";


@Injectable()
export class DictService extends TreeService<Dict>{

    constructor(
        protected http: HttpClient,
        protected publicService: PublicService) {
        super(http, publicService.getServiceCtx('sys_dict') + '/sys/dict')
    }




}
