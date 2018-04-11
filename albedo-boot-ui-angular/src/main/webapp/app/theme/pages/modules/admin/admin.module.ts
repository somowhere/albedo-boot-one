import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { MetricsModule } from "./metrics/metrics.module";
import { LogsModule } from "./logs/logs.module";
import { HealthModule } from "./health/health.module";
import { ConfigurationModule } from "./configuration/configuration.module";
import { AuditsModule } from "./audits/audits.module";
import { DocsModule } from "./docs/docs.module";
import { PasswordModule } from "./password/password.module";



@NgModule({
    imports: [
        MetricsModule,
        LogsModule,
        HealthModule,
        ConfigurationModule,
        AuditsModule,
        DocsModule,
        PasswordModule,
        /* albedo-boot-needle-add-entity-module */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminModule {
}
