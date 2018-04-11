import { General } from "./general.model"
import { Data } from "./data.model"

export class Tree extends Data {
    static F_NAME: "name"
    static F_PARENTID: "parentId"
    static F_PARENTIDS: "parentIds"
    static F_ISLEAF: "isLeaf"
    static F_SORT: "sort"
    static F_PARENT: "parent"
    /*
    /*** 模块名称 */
    public name?: string
    /*** 上级模块 */
    public parentId?: string
    /*** 上级模块 */
    public parentIds?: string
    /*** 序号 */
    public sort?: number
    /*** 父模块名称 */
    public parentName?: string
    public isLeaf?: string

    public id?: string
    public status: string
    public description?: string

    constructor() {
        super()
        this.sort = 0
    }
}
