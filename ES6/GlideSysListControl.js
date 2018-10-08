/**
 * The scoped GlideSysListControl class allows you to determine if the New or Edit buttons
 * are displayed.
 * @class GlideSysListControl
 * @typedef {Object}  GlideSysListControl
 */
class GlideSysListControl {
    /**
     * Instantiates a GlideSysListControl object.
     * @param {String} tableName Name of the table
     */
    constructor(tableName) {}
    /**
     * Returns the sys_id for the control.
     * @returns sys_id of the control
     * @example var sysListCtrl = new GlideSysListControl("incident");
     * var controlID = sysListCtrl.getControlID();
     * gs.info(controlID);
     */
    getControlID() {}
    /**
     * Returns true if the edit button is not displayed.
     * @returns True when the edit button is not displayed.
     * @example var sysListCtrl = new GlideSysListControl("incident");
     * var isOmitted = sysListCtrl.isOmitEditButton();
     * gs.info(isOmitted);
     */
    isOmitEditButton() {}
    /**
     * Returns true when the New button is not displayed.
     * @returns True when the new button is not displayed.
     * @example var sysListCtrl = new GlideSysListControl("incident");
     * var isOmitted = sysListCtrl.isOmitNewButton();
     * gs.info(isOmitted);
     */
    isOmitNewButton() {}
}