
export class ComboSearch {

    /**下拉列表隐藏值*/
    public id?: string
    /**下拉列表显示值*/
    public name?: string
    /**树形结构父节点*/
    public parentId?: string
    /**数据源地址*/
    public url?: string
    /**目标*/
    public target?: string
    /**数据源地址Hql 拼接条件*/
    public where?: string
    /**实体名称*/
    public module?: string
    /**是否显示复选框*/
    public ckecked?: string
    /**排除掉的编号（不能选择的编号）*/
    public extId?: string
    /**默认选择值*/
    public selectIds?: string
}
