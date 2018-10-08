/**
 * The GlideDialogWindow API provides methods for displaying a dialog in
 * the current window and frame.
 * @class GlideDialogWindow
 * @typedef {Object}  GlideDialogWindow
 */
class GlideDialogWindow {
    /**
     * Provides methods for displaying a dialog in the current window and frame.
     * @param {String} id Name of the UI page to load into the dialog window.
     * @param {Boolean} readOnly Optional. Flag that indicates whether the dialog window is read only (true) or
     * read/write (false). Default: false
     * @param {Number} width Optional. Size (in pixels) to set the width of the dialog window.
     * @param {Number} height Optional. Size (in pixels) to set the height of the dialog window.
     */
    constructor(id, readOnly, width, height) {}
    /**
     * Adjusts the body height of a dialog window to be the window height minus the header
     * height.
     * @returns Method does not return a value
     * @example var gdw = new GlideDialogWindow('show_list');
     * gdw.setTitle('Test');
     * gdw.setSize(750,300);
     * gdw.adjustBodySize();
     * gdw.render();
     */
    adjustBodySize() {}
    /**
     * Closes the dialog window.
     * @returns Method does not return a value
     * @example //Destroy the current dialog window.
     * GlideDialogWindow.get().destroy();
     */
    destroy() {}
    /**
     * Renders the dialog window.
     * @returns Method does not return a value
     * @example var gdw = new GlideDialogWindow('show_list');
     * gdw.setTitle('Test');
     * gdw.setSize(750,300);
     * gdw.setPreference('table', 'u_test_list');
     * gdw.setPreference('title', 'A New Title');
     * gdw.render();
     */
    render() {}
    /**
     * Sets a given window property to a specified value.
     * @param {String} name The window property to set.
     * @param {String} value The value for the window property.
     * @returns Method does not return a value
     * @example var gdw = new GlideDialogWindow('show_list');
     * gdw.setTitle('Test');
     * gdw.setSize(750,300);
     * gdw.setPreference('table', 'u_test_list');
     * gdw.setPreference('title', 'A New Title');
     */
    setPreference(name, value) {}
    /**
     * Sets the size of the dialog window.
     * @param {Number} width The width of the dialog window.
     * @param {Number} height The height of the dialog window.
     * @returns Method does not return a value
     * @example var gdw = new GlideDialogWindow('show_list');
     * gdw.setSize(750,300);
     */
    setSize(width, height) {}
    /**
     * Sets the title of the dialog window.
     * @param {String} title The title for the current window.
     * @returns Method does not return a value
     * @example //var gdw = new GlideDialogWindow('show_list');
     * gdw.setTitle('test');
     */
    setTitle(title) {}
}