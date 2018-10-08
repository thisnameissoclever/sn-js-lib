/**
 * GlideMenu methods are used in UI Context Menus, in the onShow scripts to customize UI
 * Context Menu items.
 * @class GlideMenu
 * @typedef {Object}  GlideMenu
 */
class GlideMenu {
    constructor() {}
    /**
     * Clears the image for an item.
     * @param {GlideMenuItem} item Specifies the item to have its image removed from display.
     * @returns Method does not return a value
     * @example g_menu.clearImage(g_item);
     */
    clearImage(item) {}
    /**
     * Clears any selection images from items in the menu.
     * @returns Method does not return a value
     */
    clearSelected() {}
    /**
     * Returns a menu item by item ID.
     * @param {String} itemID Specifies the item to be returned.
     * @returns The menu item
     */
    getItem(itemID) {}
    /**
     * Disables a menu item so that it cannot be selected. The disabled menu item is displayed
     * in a lighter color (grayed out) to indicate it is disabled.
     * @param {GlideMenuItem} item The item to be disabled.
     * @returns Method does not return a value
     * @example g_menu.setDisabled(g_item);
     */
    setDisabled(item) {}
    /**
     * Enables the specified menu item.
     * @param {GlideMenuItem} item The item to be enabled.
     * @returns Method does not return a value
     * @example g_menu.setEnabled(g_item);
     */
    setEnabled(item) {}
    /**
     * Hides the specified menu item.
     * @param {GlideMenuItem} item The item to be hidden.
     * @returns Method does not return a value
     * @example g_menu.setHidden(g_item);
     */
    setHidden(item) {}
    /**
     * Sets an image for an item.
     * @param {GlideMenuItem} item the item to have the image displayed.
     * @param {String} imgSrc the image to attach to the menu item.
     * @returns Method does not return a value
     * @example g_menu.setImage(g_item, 'images/checked.gifx');
     */
    setImage(item, imgSrc) {}
    /**
     * Sets the display label for a menu item. The label may contain HTML.
     * @param {GlideMenuItem} item the item to be labeled.
     * @param {String} label the label to be displayed. The string may contain HTML.
     * @returns Method does not return a value
     * @example g_menu.setLabel(g_item, "This is a new label");
     */
    setLabel(item, label) {}
    /**
     * Displays the specified item.
     * @param {GlideMenuItem} item The item to be displayed.
     * @returns Method does not return a value
     * @example g_menu.setVisible(g_item);
     */
    setVisible(item) {}
}