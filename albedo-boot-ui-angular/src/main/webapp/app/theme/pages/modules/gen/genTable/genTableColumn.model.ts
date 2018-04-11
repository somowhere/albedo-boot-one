
import { SYS_NO } from "../../../../../app.constants"
import { Data } from "../../../../../shared/base/model/data.model";

export class GenTableColumn extends Data {
    /**
     * 归属表
     */
    public genTableId?: string
    /**
     * 列名
     */
    public name?: string
    /**
     * 描述
     */
    public comments?: string
    /**
     * JDBC类型
     */
    public jdbcType?: string
    /**
     * JAVA类型
     */
    public javaType?: string
    /**
     * JAVA字段名
     */
    public javaField?: string
    /**
     * 是否主键（1：主键）
     */
    public isPk?: number
    /**
     * 是否唯一（1：是；0：否）
     */
    public isUnique?: number
    /**
     * 是否可为空（1：可为空；0：不为空）
     */
    public isNull?: number
    /**
     * 是否为插入字段（1：插入字段）
     */
    public isInsert?: number
    /**
     * 是否编辑字段（1：编辑字段）
     */
    public isEdit?: number
    /**
     * 是否列表字段（1：列表字段）
     */
    public isList?: number
    /**
     * 是否查询字段（1：查询字段）
     */
    public isQuery?: number
    /**
     * 查询方式（等于、不等于、大于、小于、范围、左LIKE、右LIKE、左右LIKE）
     */
    public queryType?: string
    /**
     * 字段生成方案（文本框、文本域、下拉框、复选框、单选框、字典选择、人员选择、部门选择、区域选择）
     */
    public showType?: string
    /**
     * 字典类型
     */
    public dictType?: string
    /**
     * 排序（升序）
     */
    public sort?: number

    /**
     * hibernate验证表达式
     */
    public hibernateValidatorExprssion?: string


    public nameAndTitle?: string

    constructor() {
        super()
        this.isPk = SYS_NO
        this.isUnique = SYS_NO
        this.isNull = SYS_NO
        this.isInsert = SYS_NO
        this.isEdit = SYS_NO
        this.isList = SYS_NO
        this.isQuery = SYS_NO
    }

}
