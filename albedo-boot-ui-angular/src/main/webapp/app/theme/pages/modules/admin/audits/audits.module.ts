
import { AuditsComponent } from "./audits.component";
import { AuditsService } from "./audits.service";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { routeChilds } from "../../../../api.routing.module";
import { AlbedoBootSharedModule } from "../../../../../shared/shared.module";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { LayoutModule } from "../../../../layouts/layout.module";


const routesAudits = [
    {
        path: 'sys/audits',
        component: AuditsComponent
    }
];

routeChilds.push(...routesAudits)
@NgModule({
    imports: [
        AlbedoBootSharedModule,
        CommonModule,
        RouterModule,
        // RouterModule.forChild(routes),
        LayoutModule
    ], exports: [
        AuditsComponent,
        // RouterModule
    ], entryComponents: [
        AuditsComponent,
    ], declarations: [
        AuditsComponent,
    ], providers: [
        AuditsService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AuditsModule {



}

