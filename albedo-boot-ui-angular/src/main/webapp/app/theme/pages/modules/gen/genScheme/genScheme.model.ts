import { Data } from "../../../../../shared/base/model/data.model";
import { GenTable } from "../genTable/genTable.model"

export class GenScheme extends Data {
    /**
     * 名称
     */
    public name?: string
    /**
     * 分类
     */
    public category?: string
    /**
     * 视图类型 0 普通表格 1 表格采用ajax刷新
     */
    public viewType?: number
    /**
     * 生成包路径
     */
    public packageName?: string
    /**
     * 生成模块名
     */
    public moduleName?: string
    /**
     * 生成子模块名
     */
    public subModuleName?: string
    /**
     * 生成功能名
     */
    public functionName?: string
    /**
     * 生成功能名（简写）
     */
    public functionNameSimple?: string
    /**
     * 生成功能作者
     */
    public functionAuthor?: string
    /**
     * 业务表编号
     */
    public genTableId?: string
    /**
     * 业务表
     */
    public genTable?: GenTable


}
