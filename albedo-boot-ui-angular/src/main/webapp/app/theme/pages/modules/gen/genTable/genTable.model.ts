import { Data } from "../../../../../shared/base/model/data.model";
import { GenTableColumn } from "./genTableColumn.model"

export class GenTable extends Data {
    /*** 编码 */
    public name?: string
    /*** 描述 */
    public comments?: string
    /*** 实体类名称 */
    public className?: string
    /*** 关联父表 */
    public parentTable?: string
    /*** 关联父表外键 */
    public parentTableFk?: string
    /*** 父表对象 */
    private parentName?: string
    public nameAndTitle?: string
    /*** 按名称模糊查询 */
    public nameLike?: string

    public category?: string

    public columnList?: GenTableColumn[]
    public columnFormList?: GenTableColumn[]


}
