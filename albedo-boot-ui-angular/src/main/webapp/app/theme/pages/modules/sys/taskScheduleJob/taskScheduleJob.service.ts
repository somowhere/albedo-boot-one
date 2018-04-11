import { Injectable } from '@angular/core'
import { Http } from '@angular/http'
import { CTX } from "../../../../../app.constants"
import { DataService } from "../../../../../shared/base/service/data.service";
import { TaskScheduleJob } from "./taskScheduleJob.model";
import { HttpClient } from "@angular/common/http";
import { PublicService } from "../../../../../shared/base/service/public.service";


@Injectable()
export class TaskScheduleJobService extends DataService<TaskScheduleJob> {

    constructor(
        protected http: HttpClient,
        protected publicService: PublicService) {
        super(http, publicService.getServiceCtx('sys_taskScheduleJob') + '/sys/taskScheduleJob')
    }

}
