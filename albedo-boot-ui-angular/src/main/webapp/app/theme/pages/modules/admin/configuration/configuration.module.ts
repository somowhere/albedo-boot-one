import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { AlbedoBootSharedModule } from "../../../../../shared/shared.module";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { LayoutModule } from "../../../../layouts/layout.module";
import { routeChilds } from "../../../../api.routing.module";
import { ConfigurationComponent } from "./configuration.component";
import { ConfigurationService } from "./configuration.service";

const routesConfiguration = [
    {
        path: 'sys/configuration',
        component: ConfigurationComponent
    }
];

routeChilds.push(...routesConfiguration)
@NgModule({
    imports: [
        AlbedoBootSharedModule,
        CommonModule,
        RouterModule,
        // RouterModule.forChild(routes),
        LayoutModule
    ], exports: [
        ConfigurationComponent,
        // RouterModule
    ], entryComponents: [
        ConfigurationComponent,
    ], declarations: [
        ConfigurationComponent,
    ], providers: [
        ConfigurationService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ConfigurationModule {



}

