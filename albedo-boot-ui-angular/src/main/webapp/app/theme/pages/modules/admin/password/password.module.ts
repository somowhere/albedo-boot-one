import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { AlbedoBootSharedModule } from "../../../../../shared/shared.module";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { LayoutModule } from "../../../../layouts/layout.module";
import { routeChilds } from "../../../../api.routing.module";
import { PasswordComponent } from "./password.component";
import { PasswordService } from "./password.service";


const routesPassword = [
    {
        path: 'sys/password',
        component: PasswordComponent
    }
];

routeChilds.push(...routesPassword)
@NgModule({
    imports: [
        AlbedoBootSharedModule,
        CommonModule,
        RouterModule,
        LayoutModule
    ], exports: [
        PasswordComponent,
    ], entryComponents: [
        PasswordComponent,
    ], declarations: [
        PasswordComponent,
    ], providers: [
        PasswordService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PasswordModule {



}
