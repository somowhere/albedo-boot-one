import { NgModule } from '@angular/core'
import { AlbedoBootSharedLibsModule } from "./shared-libs.module"
import { AlbTreeShowComponent } from "./tags/tree.show.component"
import { AlbIcoShowComponent } from "./tags/ico.show.component"
import { DictService } from "../theme/pages/modules/sys/dict/dict.service";
import { AlbFormComponent } from "./tags/form.component";
import { AlbTreeSelectComponent } from "./tags/tree.select.component";


@NgModule({
    imports: [
        AlbedoBootSharedLibsModule
    ],
    declarations: [
        AlbFormComponent,
        AlbTreeSelectComponent,
        AlbTreeShowComponent,
        AlbIcoShowComponent,
        // AlbFormTestComponent
    ],
    providers: [
        DictService
    ],
    exports: [
        AlbedoBootSharedLibsModule,
        AlbFormComponent,
        AlbTreeSelectComponent,
        AlbTreeShowComponent,
        AlbIcoShowComponent,
        // AlbFormTestComponent
    ]

})
export class AlbedoBootSharedCommonModule {
}
