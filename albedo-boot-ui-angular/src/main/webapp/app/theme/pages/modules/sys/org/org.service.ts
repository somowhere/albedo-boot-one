import { Injectable } from '@angular/core'
import { Org } from "./org.model"
import { HttpClient } from "@angular/common/http";
import { PublicService } from "../../../../../shared/base/service/public.service";
import { TreeService } from "../../../../../shared/base/service/tree.service";


@Injectable()
export class OrgService extends TreeService<Org> {

    constructor(
        protected http: HttpClient,
        protected publicService: PublicService) {
        super(http, publicService.getServiceCtx('sys_org') + '/sys/org')
    }

}
