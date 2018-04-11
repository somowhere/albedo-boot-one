import { Data } from "../../../../../shared/base/model/data.model";

export class TaskScheduleJob extends Data {

    /** name 名称 */
    public name?: string
    /** group 分组 */
    public group?: string
    /** jobStatus 任务状态 */
    public jobStatus?: string
    /** cronExpression cron表达式 */
    public cronExpression?: string
    /** beanClass 任务执行时调用哪个类的方法 包名+类名 */
    public beanClass?: string
    /** isConcurrent 任务是否有状态 */
    public isConcurrent?: string
    /** springId spring bean */
    public springId?: string
    /** sourceId source_id */
    public sourceId?: string
    /** methodName 任务调用的方法名 */
    public methodName?: string
    /** methodParams method_params */
    public methodParams?: string

}
