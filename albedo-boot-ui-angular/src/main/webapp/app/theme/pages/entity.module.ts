import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'

import { UserModule } from "./modules/sys/user/user.module"
import { RoleModule } from "./modules/sys/role/role.module"
import { OrgModule } from "./modules/sys/org/org.module"
import { ModuleModule } from "./modules/sys/module/module.module"
import { DictModule } from "./modules/sys/dict/dict.module"
import { GenTableModule } from "./modules/gen/genTable/genTable.module"
import { GenSchemeModule } from "./modules/gen/genScheme/genScheme.module"
import { TaskScheduleJobModule } from "./modules/sys/taskScheduleJob/taskScheduleJob.module";
import { AreaModule } from "./modules/sys/area/area.module";
import { AdminModule } from "./modules/admin/admin.module";
import { TestBookModule } from "./modules/test/testBook/testBook.module";
import { TestTree } from "./modules/test/testTree/testTree.model";
import { TestTreeModule } from "./modules/test/testTree/testTree.module";


@NgModule({
    imports: [
        AdminModule,
        UserModule,
        RoleModule,
        OrgModule,
        ModuleModule,
        DictModule,
        GenTableModule,
        GenSchemeModule,
        TaskScheduleJobModule,
        AreaModule,
        TestBookModule,
        TestTreeModule,
        /* albedo-boot-needle-add-entity-module */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AlbedoBootEntityModule {
}
