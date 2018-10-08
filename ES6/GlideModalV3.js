/**
 * Provides methods for displaying a content overlay.
 * @class GlideModalV3
 * @typedef {Object}  GlideModalV3
 */
class GlideModalV3 {
    /**
     * Creates an instance of the GlideModalV3 class.
     * @param {String} id The UI page to load into the modal.
     * @param {Boolean} readOnly When true, hides the close button.
     * @param {Number} width The width in pixels.
     */
    constructor(id, readOnly, width) {}
    /**
     * Get a GlideModal object by ID.
     * @param {String} id The element id of the GlideModal object.
     * @returns The object.
     */
    get(id) {}
    /**
     * Returns the value of the specified property.
     * @param {String} name The property name
     * @returns The specified property's value
     * @example var gm = new GlideModal('UI_dialog_name');
     * //Sets the dialog title
     * gm.setTitle('Show title');
     * //returns the value of the title
     * var title = gm.getPreference('title');
     * gm.setWidth(550);
     * //Opens the dialog
     * gm.render();
     * 
     */
    getPreference(name) {}
    /**
     * Renders the UI page in the modal.
     * @returns Method does not return a value
     * @example var gm = new GlideModal("UI_dialog_name");
     * //Sets the dialog title
     * gm.setTitle('Show title');
     * gm.setWidth(550);
     * //Opens the dialog
     * gm.render();
     * 
     */
    render() {}
    /**
     * Display a modal with the specified HTML content.
     * @param {Object} html The HTML content to be shown in the modal.
     * @returns Method does not return a value
     */
    renderWithContent(html) {}
    /**
     * Display a modal with the specified HTML content.
     * @param {String} html The HTML content to be shown in the modal.
     * @returns Method does not return a value
     */
    renderWithContent(html) {}
    /**
     * Set a property that is read by the loaded UI page.
     * @param {String} name The property name
     * @param {String} value The property value
     * @returns Method does not return a value
     * @example var gm = new GlideModal('UI_dialog_name');
     * //Sets the dialog title
     * gm.setTitle('Show title');
     * gm.setPreference('table', 'task');
     * gm.setPreference('name', 'value');
     * //Opens the dialog
     * gm.render();
     * 
     */
    setPreference(name, value) {}
    /**
     * Set the properties and reload the modal.
     * @param {Array} properties An array of name-value pairs to be set.
     * @returns Method does not return a value
     */
    setPreferenceAndReload(properties) {}
    /**
     * Sets the title of the modal.
     * @param {String} title The title to be displayed
     * @returns Method does not return a value
     * @example var gm = new GlideModal('UI_dialog_name');
     * //Sets the dialog title
     * gm.setTitle('Show title');
     * gm.setPreference('name', 'value');
     * //Opens the dialog
     * gm.render();
     * 
     */
    setTitle(title) {}
    /**
     * Set the width in pixels.
     * @param {Number} width The number of pixels.
     * @returns Method does not return a value
     * @example var gm = new GlideModal('UI_dialog_name');
     * //Sets the dialog title
     * gm.setTitle('Show title');
     * gm.setPreference('name', 'value');
     * gm.setWidth(550);
     * //Opens the dialog
     * gm.render();
     * 
     */
    setWidth(width) {}
    /**
     * Change the view and reload the modal.
     * @param {String} newView The view to use.
     * @returns Method does not return a value
     */
    switchView(newView) {}
}