/**
 * Copyright &copy; 2018 <a href="https://github.com/somewhereMrli/albedo-boot">albedo-boot</a> All rights reserved.
 */
import { Data } from "../../../../../shared/base/model/data.model";

export class TestBook extends Data {

    /** title 标题 */
    public title?: string
    /** author 作者 */
    public author?: string
    /** name 名称 */
    public name?: string
    /** email 邮箱 */
    public email?: string
    /** phone 手机 */
    public phone?: string
    /** activated activated_ */
    public activated?: number
    /** langKey key */
    public langKey?: string
    /** activationKey activation_key */
    public activationKey?: string
    /** resetKey reset_key */
    public resetKey?: string
    /** resetDate reset_date */
    public resetDate?: string

}
