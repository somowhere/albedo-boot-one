/* SystemJS module definition */
declare var module: NodeModule

interface NodeModule {
    id: string
}

declare let CRLT: any

declare var albedoList: AlbedoList

interface AlbedoList {
    init(target?: any): void
    initHtmlTable(table?: any, option?: any): void
    initTable(table: any, formSearch: any, option?: any): void

    initModal(callback?: any, btn?: any, target?: any): void;

}
declare var albedoForm: AlbedoForm

interface AlbedoForm {
    init(target?: any): void

    initSave(target?: any, validateFun?: any): void

    initValidate(target?: any, option?: any): void

    validate(target?: any): void
    setData(selector: string, data: any): void
    getData(selector: string): any
    initFormData(selector: string, data: any): void
    clearDataBylikeKey(keyLike: string): void

    clearData(): void

    initTree(target?: any): void
}

declare var albedo: Albedo

interface Albedo {
    setCtx(ctx: any): void

    setGatewayModel(gatewayModel: any): void

    getGatewayModel(): boolean

    setToken(token: any): void

    setUserCookie(key: string, value: any): void

    getUserCookie(s: string): any

    setUserId(userId: String): void

    setSessionStorage(sessionStorage: any): void

    getSessionStorage(): any

    toStr(obj: any): string;

}
declare var mApp: MApp

interface MApp {
    alert(options: any): void
}


declare var toastr: Toastr

interface Toastr {
    info(message: string, options?: any): void
    warning(message: string, options?: any): void
    success(message: string, options?: any): void
    error(message: string, options?: any): void
}




interface JQuery {
    mMenu(options: any): JQuery

    animateClass(options: any): JQuery

    setActiveItem(item: any): JQuery

    getPageTitle(item: any): JQuery

    getBreadcrumbs(item: any): JQuery

    validate(options?: any): JQuery

    mDatatable(options: any): JQuery

    loadFilterGird(): JQuery

    selectpicker(): JQuery

    select2(): JQuery

    valid(): JQuery

    resetForm(): JQuery

    markdown(): JQuery

    mTreeInit(obj: any, setting: any, data: any): JQuery

    mTreeObj(s: string): any

    modal(option?: any): JQuery
    serializeObject(obj: any): any
}



