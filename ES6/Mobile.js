/**
 * Mobile GlideForm (g_form) methods enable you to work with forms on the mobile
 * platform.
 * @class Mobile
 * @typedef {Object}  Mobile
 */
class Mobile {
    constructor() {}
    /**
     * Adds a decorative icon next to a field.
     * @param {String} fieldName The field name.
     * @param {String} icon The font icon to show next to the field.
     * @param {String} text The text title for the icon (used for screen readers).
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
    addDecoration(fieldName, icon, text) {}
    /**
     * Gets the form label text.
     * @param {String} fieldName The field name.
     * @returns The label text.
     * @example if (g_user.hasRole('itil')) {
     * var oldLabel = g_form.getLabel('comments');
     * g_form.setLabel('comments', oldLabel + ' (Customer visible)');
     * }
     */
    getLabel(fieldName) {}
    /**
     * Determines if a field is present on the form.
     * @param {String} fieldName The field to look for.
     * @returns True if the field is present on the form; false, if it is not. On the form means that the
     * field is part of g_form. It could still be hidden, read-only, mandatory, or
     * invalid.
     * @example if (g_form.hasField('assignment_group'))
     * g_form.setMandatory('assigned_to', true);
     * 
     */
    hasField(fieldName) {}
    /**
     * Removes a decorative icon from next to a field.
     * @param {String} fieldName The field name.
     * @param {String} icon The icon to remove.
     * @param {String} text The text title for the icon.
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
    removeDecoration(fieldName, icon, text) {}
    /**
     * Sets the form label text.
     * @param {String} fieldName The field name.
     * @param {String} label The field label text.
     * @returns Method does not return a value
     * @example if (g_user.hasRole('itil')) {
     * var oldLabel = g_form.getLabel('comments');
     * g_form.setLabel('comments', oldLabel + ' (Customer visible)');
     * }
     */
    setLabel(fieldName, label) {}
}