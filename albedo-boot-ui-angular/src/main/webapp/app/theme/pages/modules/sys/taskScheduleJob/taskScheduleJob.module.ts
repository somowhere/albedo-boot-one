import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { TaskScheduleJobComponent } from "./taskScheduleJob.component";
import { routeChilds } from "../../../../api.routing.module";
import { AlbedoBootSharedModule } from "../../../../../shared/shared.module";
import { LayoutModule } from "../../../../layouts/layout.module";
import { TaskScheduleJobService } from "./taskScheduleJob.service";
import { TaskScheduleJobFormComponent } from "./taskScheduleJob.form.component";

const routesSysTaskScheduleJob = [
    {
        path: "sys/taskScheduleJob/list",
        component: TaskScheduleJobComponent
    },
    {
        path: "sys/taskScheduleJob/form",
        component: TaskScheduleJobFormComponent
    },
    {
        path: "sys/taskScheduleJob/form/:id",
        component: TaskScheduleJobFormComponent
    },
];

routeChilds.push(...routesSysTaskScheduleJob)


@NgModule({
    imports: [
        AlbedoBootSharedModule,
        CommonModule,
        RouterModule,
        LayoutModule
    ], exports: [
        TaskScheduleJobComponent,
    ], entryComponents: [
        TaskScheduleJobComponent,
    ], declarations: [
        TaskScheduleJobComponent,
        TaskScheduleJobFormComponent
    ], providers: [
        TaskScheduleJobService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TaskScheduleJobModule {


}
