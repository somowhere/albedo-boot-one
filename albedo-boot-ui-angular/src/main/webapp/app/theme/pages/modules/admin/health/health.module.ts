import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { AlbedoBootSharedModule } from "../../../../../shared/shared.module";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { LayoutModule } from "../../../../layouts/layout.module";
import { routeChilds } from "../../../../api.routing.module";
import { HealthCheckComponent } from "./health.component";
import { HealthService } from "./health.service";
import { HealthModalComponent } from "./health.modal.component";

const routesHealth = [
    {
        path: 'sys/health',
        component: HealthCheckComponent
    }
];

routeChilds.push(...routesHealth)
@NgModule({
    imports: [
        AlbedoBootSharedModule,
        CommonModule,
        RouterModule,
        // RouterModule.forChild(routes),
        LayoutModule
    ], exports: [
        HealthCheckComponent,
        // RouterModule
    ], entryComponents: [
        HealthCheckComponent,
        HealthModalComponent
    ], declarations: [
        HealthCheckComponent,
        HealthModalComponent
    ], providers: [
        HealthService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HealthModule {



}

