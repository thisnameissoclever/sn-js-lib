/**
 * The GlideForm API provides methods to customize forms. GlideForm.js is the JavaScript
 * class containing the methods. The global object g_form is used to access GlideForm methods.
 * GlideForm methods are only used on the client.
 * @class GlideForm
 * @typedef {Object}  GlideForm
 */
class GlideForm {
    constructor() {}
    /**
     * Adds an icon on a field’s label.
     * @param {String} fieldName The field name.
     * @param {String} icon The font icon to show next to the field. Supported icons - icon-user,
     * icon-user-group, icon-lightbulb, icon-home, icon-mobile, icon-comment, icon-mail,
     * icon-locked, icon-database, icon-book, icon-drawer, icon-folder, icon-catalog,
     * icon-tab, icon-cards, icon-tree-right, icon-tree, icon-book-open, icon-paperclip,
     * icon-edit, icon-trash, icon-image, icon-search, icon-power, icon-cog, icon-star,
     * icon-star-empty, icon-new-ticket, icon-dashboard, icon-cart-full, icon-view,
     * icon-label, icon-filter, icon-calendar, icon-script, icon-add, icon-delete,
     * icon-help, icon-info, icon-check-circle, icon-alert, icon-sort-ascending,
     * icon-console, icon-list, icon-form, and icon-livefeed.
     * @param {String} title The text title for the icon.
     * @returns Method does not return a value
     * @example g_form.addDecoration('caller_id', 'icon-star', 'preferred member');
     */
    addDecoration(fieldName, icon, title) {}
    /**
     * Adds an icon on a field’s label.
     * @param {String} fieldName The field name.
     * @param {String} icon The font icon to show next to the field. Supported icons - icon-user,
     * icon-user-group, icon-lightbulb, icon-home, icon-mobile, icon-comment, icon-mail,
     * icon-locked, icon-database, icon-book, icon-drawer, icon-folder, icon-catalog,
     * icon-tab, icon-cards, icon-tree-right, icon-tree, icon-book-open, icon-paperclip,
     * icon-edit, icon-trash, icon-image, icon-search, icon-power, icon-cog, icon-star,
     * icon-star-empty, icon-new-ticket, icon-dashboard, icon-cart-full, icon-view,
     * icon-label, icon-filter, icon-calendar, icon-script, icon-add, icon-delete,
     * icon-help, icon-info, icon-check-circle, icon-alert, icon-sort-ascending,
     * icon-console, icon-list, icon-form, and icon-livefeed.
     * @param {String} title The text title for the icon.
     * @param {String} color A CSS color.
     * @returns Method does not return a value
     * @example g_form.addDecoration('caller_id', 'icon-star', 'Mark as Favorite', 'color-green');
     */
    addDecoration(fieldName, icon, title, color) {}
    /**
     * Displays the error message at the top of the form.
     * @param {String} message The message to display.
     * @returns Method does not return a value
     * @example g_form.addErrorMessage('This is an error');
     */
    addErrorMessage(message) {}
    /**
     * Adds an informational message to the top of the form.
     * @param {String} message The message to display.
     * @returns Method does not return a value
     * @example g_form.addInfoMessage('The top five fields in this form are mandatory');
     */
    addInfoMessage(message) {}
    /**
     * Adds a choice to the end of a choice list field.
     * @param {String} fieldName The name of the field.
     * @param {String} choiceValue The value to be stored in the database.
     * @param {String} choiceLabel The value displayed.
     * @returns Method does not return a value
     * @example g_form.addOption('priority', '6', '6 - Really Low');
     */
    addOption(fieldName, choiceValue, choiceLabel) {}
    /**
     * Adds a choice to the choice list field at the position specified.
     * @param {String} fieldName The field name.
     * @param {String} choiceValue The value stored in the database.
     * @param {String} choiceLabel The value displayed.
     * @param {Number} choiceIndex Order of the choice in the list. The index is into a zero based array.
     * @returns Method does not return a value
     * @example g_form.addOption('priority', '2.5', '2.5 - Moderately High', 3);
     */
    addOption(fieldName, choiceValue, choiceLabel, choiceIndex) {}
    /**
     * Removes all informational and error messages from the top of the form.
     * @returns Method does not return a value
     * @example g_form.clearMessages();
     */
    clearMessages() {}
    /**
     * Removes all options from the choice list.
     * @param {String} fieldName Name of the field.
     * @returns Method does not return a value
     */
    clearOptions(fieldName) {}
    /**
     * Removes any value(s) from the field.
     * @param {String} fieldName Name of the field.
     * @returns Method does not return a value
     */
    clearValue(fieldName) {}
    /**
     * Prevents file attachments from being added.
     * @returns Method does not return a value
     */
    disableAttachments() {}
    /**
     * Allows file attachments to be added. Shows the paper clip icon.
     * @returns Method does not return a value
     */
    enableAttachments() {}
    /**
     * Used to draw attention to a particular field. Flashes the specified color the specified
     * number of times in the specified field.
     * @param {String} widgetName Specifies the field in the as .
     * @param {String} color RGB color or acceptable CSS color.
     * @param {Number} count Specifies how long the label will flash.
     * use 2 for a 1-second flash
     * use 0 for a 2-second flash
     * use -2 for a 3-second flash
     * use -4 for a 4-second flash
     * 
     * @returns Method does not return a value
     * @example g_form.flash("incident.number", "#FFFACD", 0);
     */
    flash(widgetName, color, count) {}
    /**
     * Returns the most recent action name, or, for a client script, the sys_id of the UI
     * action clicked.
     * @returns The current action name.
     * @example function onSubmit() {
     * var action = g_form.getActionName();
     * alert('You pressed ' + action);
     * }
     */
    getActionName() {}
    /**
     * Returns a Boolean value for the specified field.
     * @param {String} fieldName Name of the field.
     * @returns Returns false if the field value is false or undefined; otherwise returns
     * true.
     */
    getBooleanValue(fieldName) {}
    /**
     * Returns the HTML element for the specified field.
     * @param {String} fieldName Name of the field.
     * @returns The field's HTML element.
     */
    getControl(fieldName) {}
    /**
     * Returns the decimal value of the specified field.
     * @param {String} fieldName The name of the field.
     * @returns The decimal value of the specified field.
     * @example function onChange(control, oldValue, newValue, isLoading) {
     * alert(g_form.getDecimalValue('percent_complete'));
     * }
     */
    getDecimalValue(fieldName) {}
    /**
     * Returns the HTML element specified by the parameter.
     * @param {String} id The field id.
     * @returns The field's HTML element.
     */
    getElement(id) {}
    /**
     * Returns the HTML element for the form.
     * @returns The HTML element for the form.
     */
    getFormElement() {}
    /**
     * Returns the HTML element of the help text for the specified field.
     * @param {String} fieldName Name of the field.
     * @returns Help text field's HTML element.
     */
    getHelpTextControl(fieldName) {}
    /**
     * Returns the integer value of the field.
     * @param {String} fieldName The field name.
     * @returns Integer value of the field.
     */
    getIntValue(fieldName) {}
    /**
     * Returns the plain text value of the field label.
     * @param {String} fieldName The field name
     * @returns The label text.
     * @example if (g_user.hasRole('itil')) {
     * var oldLabel = g_form.getLabelOf('comments');
     * g_form.setLabelOf('comments', oldLabel + ' (Customer visible)');
     * }
     */
    getLabelOf(fieldName) {}
    /**
     * Returns the option element for a selected box named fieldName
     * where choiceValue matches the option value.
     * @param {String} fieldName Name of the field.
     * @param {String} choiceValue Value of the option.
     * @returns The HTMLElement for the option. Returns null if the field or option is not
     * found.
     */
    getOption(fieldName, choiceValue) {}
    /**
     * Returns the GlideRecord for a specified field.
     * @param {String} fieldName Name of the field.
     * @param {Function} callBack Name of the call back function.
     * @returns The GlideRecord object for the specified field. If the specified reference
     * cannot be found, then it returns an initialized GlideRecord object where currentRow
     * = -1 and rows.length = 0.
     * @example function onChange(control, oldValue, newValue, isLoading) {
     * var caller = g_form.getReference('caller_id', doAlert); // doAlert is our callback function
     * }
     * function doAlert(caller) { //reference is passed into callback as first arguments
     * if (caller.vip == 'true')
     * alert('Caller is a VIP!');
     * }
     */
    getReference(fieldName, callBack) {}
    /**
     * Returns all section names, whether visible or not.
     * @returns The section names.
     */
    getSectionNames() {}
    /**
     * Returns an array of the form's sections.
     * @returns The form's sections.
     * @example function onChange(control, oldValue, newValue, isLoading) {
     * //this example was run on a form divided into sections (Change form)
     * // and hid a section when the "state" field was changed
     * var sections = g_form.getSections();
     * if (newValue == '2') {
     * g_form.setSectionDisplay(sections[1], false);
     * } else {
     * g_form.setSectionDisplay(sections[1], true);
     * }
     * }
     */
    getSections() {}
    /**
     * Returns the name of the table to which this record belongs.
     * @returns Name of the table.
     * @example function onLoad() {
     * if (g_form.isNewRecord()) {
     * var tableName = g_form.getTableName(); //Get the table name
     * }
     * }
     */
    getTableName() {}
    /**
     * Returns the sys_id of the record displayed in the form.
     * @returns The record's sys_id.
     * @example function onLoad() {
     * var incSysid = g_form.getUniqueValue();
     * alert(incSysid);
     * }
     */
    getUniqueValue() {}
    /**
     * Returns the value of the specified field.
     * @param {String} fieldName The field name.
     * @returns The value of the specified field.
     * @example function onChange(control, oldValue, newValue, isLoading) {
     * alert(g_form.getValue('short_description'));
     * }
     */
    getValue(fieldName) {}
    /**
     * Hides all field messages.
     * @returns Method does not return a value
     */
    hideAllFieldMsgs() {}
    /**
     * Hides all field messages of the specified type.
     * @param {String} type The type of message, info or error.
     * @returns Method does not return a value
     */
    hideAllFieldMsgs(type) {}
    /**
     * Hides the error message placed by showErrorBox().
     * @param {String} fieldName The name of the field or control.
     * @returns Method does not return a value
     */
    hideErrorBox(fieldName) {}
    /**
     * Hides the last message placed by showFieldMsg().
     * @param {String} fieldName Name of the field.
     * @returns Method does not return a value
     */
    hideFieldMsg(fieldName) {}
    /**
     * Hides the messages placed by showFieldMsg().
     * @param {String} fieldName Name of the field.
     * @param {Boolean} clearAll When true, all messages for the field are cleared. When false, only the last
     * message is removed.
     * @returns Method does not return a value
     * @example g_form.hideFieldMsg('impact', true);
     */
    hideFieldMsg(fieldName, clearAll) {}
    /**
     * Hides the specified related list on the form.
     * @param {String} listTableName Name of the related list. Use the sys_id to hide a list through a relationship.
     * @returns Method does not return a value
     */
    hideRelatedList(listTableName) {}
    /**
     * Hides all related lists on the form.
     * @returns Method does not return a value
     */
    hideRelatedLists() {}
    /**
     * Returns true while a live update is being done on the record the form is showing.
     * @returns Returns true if a live update is happening on the record displayed by the form.
     */
    isLiveUpdating() {}
    /**
     * Returns true if the field is mandatory.
     * @param {String} fieldName Name of the field.
     * @returns True if the field is required, false otherwise.
     */
    isMandatory(fieldName) {}
    /**
     * Returns true if the record has never been saved.
     * @returns Returns true if the record has not been saved; otherwise false.
     * @example function onLoad() {
     * if(g_form.isNewRecord()){
     * alert('New Record!');
     * }
     * }
     */
    isNewRecord() {}
    /**
     * Returns true if the section is visible.
     * @returns Returns true when the section is visible; otherwise, false is returned.
     */
    isSectionVisible() {}
    /**
     * You can update a list collector variable.
     * @param {String} fieldName Name of the slush bucket.
     * @returns Method does not return a value
     * @example g_form.refreshSlushbucket('bucket');
     */
    refreshSlushbucket(fieldName) {}
    /**
     * Removes the icon from the specified field that matches the icon and title.
     * @param {String} fieldName Field name.
     * @param {String} icon Name of the icon to remove.
     * @param {String} title The icon's text title (name).
     * @returns Method does not return a value
     * @example function onChange(control, oldValue, newValue, isLoading) {
     * // if the caller_id field is not present, then we can't add an icon anywhere
     * if (!g_form.hasField('caller_id'))
     * return;
     * if (!newValue)
     * return;
     * g_form.getReference('caller_id', function(ref) {
     * g_form.removeDecoration('caller_id', 'icon-star', 'VIP');
     * if (ref.getValue('vip') == 'true')
     * g_form.addDecoration('caller_id', 'icon-star', 'VIP');
     * });
     * }
     */
    removeDecoration(fieldName, icon, title) {}
    /**
     * Removes the icon from the specified field that matches the icon, title, and
     * color.
     * @param {String} fieldName Field name.
     * @param {String} icon Name of the icon to remove.
     * @param {String} title The icon's text title (name).
     * @param {String} color A CSS color
     * @returns Method does not return a value
     * @example g_form.removeDecoration('caller_id', 'icon-star', 'VIP', 'blue');
     */
    removeDecoration(fieldName, icon, title, color) {}
    /**
     * Removes the specified option from the choice list.
     * @param {String} fieldName Name of the field.
     * @param {String} choiceValue The value stored in the database. This is not the label.
     * @returns Method does not return a value
     * @example g_form.removeOption('priority', '1');
     */
    removeOption(fieldName, choiceValue) {}
    /**
     * Saves the record without navigating away (update and stay).
     * @returns Method does not return a value
     */
    save() {}
    /**
     * Makes the specified field available or unavailable.
     * @param {String} fieldName Name of the field.
     * @param {Boolean} disable When true disables the field. When false enables the field.
     * @returns Method does not return a value
     */
    setDisabled(fieldName, disable) {}
    /**
     * Displays or hides a field.
     * @param {String} fieldname Name of the field.
     * @param {Boolean} display When true displays the field, when false hides the field.
     * @returns Method does not return a value
     * @example function onChange(control, oldValue, newValue, isLoading, isTemplate) {
     * //If the page isn't loading
     * if (!isLoading) {
     * //If the new value isn't blank
     * if (newValue != '') {
     * g_form.setDisplay('priority', false);
     * }
     * else
     * g_form.setDisplay('priority', true);
     * }
     * }
     */
    setDisplay(fieldname, display) {}
    /**
     * Sets the plain text value of the field label.
     * @param {String} fieldName The field name.
     * @param {String} label The field text label.
     * @returns Method does not return a value
     * @example if (g_user.hasRole('itil')) {
     * var oldLabel = g_form.getLabelOf('comments');
     * g_form.setLabelOf('comments', oldLabel + ' (Customer visible)');
     * }
     */
    setLabelOf(fieldName, label) {}
    /**
     * Makes the specified field mandatory.
     * @param {String} fieldName Name of the field.
     * @param {Boolean} mandatory When true makes the field mandatory. When false makes the field
     * optional.
     * @returns Method does not return a value
     */
    setMandatory(fieldName, mandatory) {}
    /**
     * Makes the specified field read only or editable.
     * @param {String} fieldName Name of the field.
     * @param {Boolean} readOnly When true makes the field read only. When false makes the field
     * editable.
     * @returns Method does not return a value
     */
    setReadOnly(fieldName, readOnly) {}
    /**
     * Shows or hides a section.
     * @param {String} sectionName The section name is lower case with an underscore replacing the first space in
     * the name, and with the remaining spaces being removed, for example "Section Four is
     * Here" becomes "section_fourishere". Other non-alphanumeric characters, such as
     * ampersand (&), are removed. Section names can be found by using the
     * getSectionNames() method.
     * @param {Boolean} display When true shows the section. When false hides the section.
     * @returns Returns true when successful.
     */
    setSectionDisplay(sectionName, display) {}
    /**
     * Sets the value of a field.
     * @param {String} fieldName Name of the field.
     * @param {String} value Value in the database.
     * @returns Method does not return a value
     * @example g_form.setValue('short_description', 'replace this with appropriate text');
     */
    setValue(fieldName, value) {}
    /**
     * Sets the value and display value of the specified field.
     * @param {String} fieldName Name of the field.
     * @param {String} value System ID for the reference value in the database. Can be an array of system
     * IDs if the field is a glide-list.
     * @param {String} displayValue Display name for the referenced value in the database. Can be an array of
     * display names if the field is a glide-list.
     * @returns Method does not return a value
     * @example g_form.setValue('assigned_to', userSysID, userName);
     * @example g_form.setValue('glide-list_field_name', sysIDArray, displayNameArray);
     */
    setValue(fieldName, value, displayValue) {}
    /**
     * Displays or hides the field.
     * @param {String} fieldName The field name.
     * @param {Boolean} display When true displays the field. When false hides the field.
     * @returns Method does not return a value
     * @example function onChange(control, oldValue, newValue, isLoading, isTemplate) {
     * //If the page isn't loading
     * if (!isLoading) {
     * //If the new value isn't blank
     * if(newValue != '') {
     * g_form.setVisible('priority', false);
     * }
     * else
     * g_form.setVisible('priority', true);
     * }
     * }
     */
    setVisible(fieldName, display) {}
    /**
     * Displays an error message under the specified form field (either a control object or
     * the name of the field). If the control or field is currently off the screen, the form scrolls to
     * the control or field.
     * @param {String} name The name of the control or field.
     * @param {String} message The message to be displayed.
     * @returns Method does not return a value
     */
    showErrorBox(name, message) {}
    /**
     * Displays an error message under the specified form field (either a control object or
     * the name of the field). If the control or field is currently off the screen and the scrollForm
     * parameter is true, the form scrolls to the control or field.
     * @param {String} name Name of the field or control.
     * @param {String} message Message to display.
     * @param {Boolean} scrollForm When true scrolls the form to the field. When false the form does not scroll to
     * the field.
     * @returns Method does not return a value
     */
    showErrorBox(name, message, scrollForm) {}
    /**
     * Displays either an informational or error message under the specified form field
     * (either a control object or the name of the field).  If the control or field is currently off
     * the screen and scrollForm is true, the form is scrolled to the field.
     * @param {String} field Name of the field or control.
     * @param {String} message Message to display.
     * @param {String} type "error","info", or "warning".
     * @param {Boolean} scrollForm When true, the form scrolls to the field if it is off screen. When false, the
     * form does not scroll.
     * @returns Method does not return a value
     * @example g_form.showFieldMsg('impact','Low impact not allowed with High priority','error',false);
     */
    showFieldMsg(field, message, type, scrollForm) {}
    /**
     * Displays the specified related list on the form.
     * @param {String} listTableName Name of the related list.
     * @returns Method does not return a value
     */
    showRelatedList(listTableName) {}
    /**
     * Displays all the form's related lists.
     * @returns Method does not return a value
     */
    showRelatedLists() {}
    /**
     * Saves the record.
     * @returns Method does not return a value
     */
    submit() {}
    /**
     * Performs the UI action specified by the parameter.
     * @param {String} verb An action_name from a sys_ui_action record. The action name must be for a
     * visible form button.
     * @returns Method does not return a value
     */
    submit(verb) {}
}
//addons
const g_form = new GlideForm();