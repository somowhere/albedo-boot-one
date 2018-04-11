export class DictQuery {

    public code?: string
    /*** 字典值 */
    public filter?: string
    constructor(code?: string, filter?: string) {
        this.code = code
        this.filter = filter
    }
}
