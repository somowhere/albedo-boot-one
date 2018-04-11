import { Tree } from "../../../../../shared/base/model/tree.model"

export class Module extends Tree {
    /*** 模块类型 0 菜单模块 1权限模块 */
    public type?: string

    public target?: string
    /*** 请求方法*/
    public requestMethod?: string
    /*** 链接地址 */
    public url?: string
    /*** 图标class */
    public iconCls?: string
    /*** 权限标识 */
    public permission?: string
    /*** 针对顶层菜单，0 普通展示下级菜单， 1以树形结构展示 */
    public showType?: string
    /*** 服务名称 */
    public microservice?: string
    /*** 菜单子节点 */
    public menuLeaf?: boolean
    /*** 顶层菜单 */
    public menuTop?: boolean
    /*** 是否显示 */
    public show?: boolean
    /*** 链接名 */
    public href?: string

    public childMenus?: Module[]

}
