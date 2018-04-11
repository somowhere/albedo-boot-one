import { General } from "./general.model"
import { Audit } from "../../../theme/pages/modules/admin/audits/audit.model";

export class PageModel<T extends General>{

    public total?: number
    public perpage: number
    public offset?: number
    public page?: number
    public data?: T[];


}
