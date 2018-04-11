import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { MetricsMonitoringComponent } from './metrics.component';
import { MetricsMonitoringModalComponent } from "./metrics.modal.component";
import { MetricsService } from "./metrics.service";
import { AlbedoBootSharedModule } from "../../../../../shared/shared.module";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { LayoutModule } from "../../../../layouts/layout.module";
import { routeChilds } from "../../../../api.routing.module";


const routesMetrics = [
    {
        path: 'sys/metrics',
        component: MetricsMonitoringComponent
    }
];

routeChilds.push(...routesMetrics)
@NgModule({
    imports: [
        AlbedoBootSharedModule,
        CommonModule,
        RouterModule,
        // RouterModule.forChild(routes),
        LayoutModule
    ], exports: [
        MetricsMonitoringComponent,
        // RouterModule
    ], entryComponents: [
        MetricsMonitoringComponent,
        MetricsMonitoringModalComponent,
    ], declarations: [
        MetricsMonitoringComponent,
        MetricsMonitoringModalComponent,
    ], providers: [
        MetricsService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MetricsModule {



}
