import { Data } from "../../../../../shared/base/model/data.model";


export class User extends Data {
    public id?: any
    public orgId?: string
    public orgName?: string
    public loginId?: string
    public firstName?: string
    public lastName?: string
    public phone?: string
    public email?: string
    public activated?: Boolean
    public langKey?: string
    public authorities?: any[]
    public password?: string
    public roleIdList?: string[]

    // constructor(
    //     id?: any,
    //     login?: string,
    //     firstName?: string,
    //     lastName?: string,
    //     email?: string,
    //     activated?: Boolean,
    //     langKey?: string,
    //     authorities?: any[],
    //     createdBy?: string,
    //     createdDate?: Date,
    //     lastModifiedBy?: string,
    //     lastModifiedDate?: Date,
    //     password?: string
    // ) {
    //     super()
    //     this.id = id ? id : null
    //     this.login = login ? login : null
    //     this.firstName = firstName ? firstName : null
    //     this.lastName = lastName ? lastName : null
    //     this.email = email ? email : null
    //     this.activated = activated ? activated : false
    //     this.langKey = langKey ? langKey : null
    //     this.authorities = authorities ? authorities : null
    //     this.createdBy = createdBy ? createdBy : null
    //     this.createdDate = createdDate ? createdDate : null
    //     this.lastModifiedBy = lastModifiedBy ? lastModifiedBy : null
    //     this.lastModifiedDate = lastModifiedDate ? lastModifiedDate : null
    //     this.password = password ? password : null
    // }
}
