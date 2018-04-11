import { Tree } from "../../../../../shared/base/model/tree.model";


export class Dict extends Tree {
    /*** 模块类型 0 菜单模块 1权限模块 */
    public type?: string

    public code?: string
    /*** 字典值 */
    public val?: string
    /*** 资源文件key */
    public showName?: string
    /*** key */
    public key?: string
    public isShow?: number
    public parentCode?: string




    constructor(
        type?: string,
        code?: string,
        /*** 字典值 */
        val?: string,
        /*** 资源文件key */
        showName?: string,
        /*** key */
        key?: string,
        isShow?: number,
        parentCode?: string
    ) {
        super()
        this.type = type ? type : null
        this.code = code ? code : null
        this.val = val ? val : null
        this.showName = showName ? showName : null
        this.key = key ? key : null
        this.isShow = isShow ? isShow : null
        this.parentCode = parentCode ? parentCode : null
    }
}
