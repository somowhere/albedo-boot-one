import { General } from "./general.model"

export class Data extends General {

    public id?: string
    public status: string
    public description?: string

    constructor() {
        super()
        this.status = General.FLAG_NORMAL
    }
}
