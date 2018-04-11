import { Tree } from "../../../../../shared/base/model/tree.model"

export class Org extends Tree {

    public code?: string
    /*** 拼音简码 */
    public en?: string
    /*** 机构类型 */
    public type?: string
    /*** 机构等级（1：一级；2：二级；3：三级；4：四级） */
    public grade?: string


}
