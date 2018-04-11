import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CTX } from "../../../../../app.constants";
import { ActivatedRoute } from "@angular/router";
import { TaskScheduleJob } from "./taskScheduleJob.model";
import { TaskScheduleJobService } from "./taskScheduleJob.service";
import { PublicService } from "../../../../../shared/base/service/public.service";

@Component({
    selector: ".sys-taskScheduleJob-form.page-form",
    templateUrl: "./taskScheduleJob.form.component.html"
})
export class TaskScheduleJobFormComponent implements AfterViewInit {

    taskScheduleJob: TaskScheduleJob;
    routeData: any;
    ctx: any;
    id: any;

    private afterViewInit = false;
    private afterLoad = false;
    constructor(
        private activatedRoute: ActivatedRoute,
        private taskScheduleJobService: TaskScheduleJobService,
        private publicService: PublicService) {
        this.ctx = publicService.getServiceCtx('sys_taskScheduleJob')
        this.taskScheduleJob = new TaskScheduleJob();
        this.routeData = this.activatedRoute.params.subscribe((params) => {
            this.id = params['id'];
            if (this.id) {
                this.taskScheduleJobService.find(this.id).subscribe((data) => {
                    this.taskScheduleJob = data;
                    albedoForm.setData("#taskScheduleJob-save-form", this.taskScheduleJob);
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

        var taskScheduleJobId = this.taskScheduleJob.id, thisCtx = this.ctx;
        albedoForm.initValidate($("#taskScheduleJob-save-form"), {
            // define validation rules
            rules: {
                name: { remote: thisCtx + '/sys/taskScheduleJob/checkByProperty?id=' + taskScheduleJobId },
            },
            messages: {
                name: { remote: '名称已存在' },
            }
        })
        albedoForm.init();
        albedoForm.initSave();

    }



}
