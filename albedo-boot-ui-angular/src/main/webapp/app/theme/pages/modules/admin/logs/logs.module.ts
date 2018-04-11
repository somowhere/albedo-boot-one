import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { AlbedoBootSharedModule } from "../../../../../shared/shared.module";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { LayoutModule } from "../../../../layouts/layout.module";
import { routeChilds } from "../../../../api.routing.module";
import { LogsComponent } from "./logs.component";
import { LogsService } from "./logs.service";


const routesLogs = [
    {
        path: 'sys/logs',
        component: LogsComponent
    }
];

routeChilds.push(...routesLogs)
@NgModule({
    imports: [
        AlbedoBootSharedModule,
        CommonModule,
        RouterModule,
        // RouterModule.forChild(routes),
        LayoutModule
    ], exports: [
        LogsComponent,
        // RouterModule
    ], entryComponents: [
        LogsComponent,
    ], declarations: [
        LogsComponent,
    ], providers: [
        LogsService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LogsModule {



}
