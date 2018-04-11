
export class General {
    /*** 状态 审核 */
    static FLAG_AUDIT: "1"
    /*** 状态 正常 */
    static FLAG_NORMAL: "0"
    /*** 状态 停用 */
    static FLAG_UNABLE: "-1"
    /*** 状态 已删除 */
    static FLAG_DELETE: "-2"
    /**
     * 状态（-2：删除；-1：停用 0：正常 1:审核）
     */
    static F_STATUS: "status"
    /*** ID */
    static F_ID: "id"
    static F_CREATEDBY: "createdBy"
    static F_CREATOR: "creator"
    static F_CREATEDDATE: "createdDate"
    static F_LASTMODIFIEDBY: "lastModifiedBy"
    static F_MODIFIER: "modifier"
    static F_LASTMODIFIEDDATE: "lastModifiedDate"
    static F_VERSION: "version"
    static F_DESCRIPTION: "description"
}
