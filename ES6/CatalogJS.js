/**
 * CatalogJS API enables you to use methods to check and retrieve
 * catalog-specific properties. To use this class in a scoped application, use the sn_sc namespace
 * identifier. The Service Catalog Scoped API plugin (com.glideapp.servicecatalog.scoped.api) that
 * is enabled by default is required to access the CatalogJS API.
 * @class CatalogJS
 * @typedef {Object}  CatalogJS
 */
class CatalogJS {
    /**
     * Creates an instance of the catalog class for the specified glide record
     * object.
     * @param {Object} gr Glide Record pointing to the sc_catalog table.
     */
    constructor(gr) {}
    /**
     * Specifies if the catalog is viewable for the user.
     * @param {Boolean} mobile True if the view is mobile view. Else, false.
     * @returns Returns true if the catalog is viewable for the user.
     * @example var catalog=new sn_sc.Catalog("e0d08b13c3330100c8b837659bba8fb4");;
     * console.log (catalog.canView(true));
     */
    canView(mobile) {}
    /**
     * If only one active catalog exists, that catalog is returned. Else, the earliest catalog
     * created is returned, from the list of the catalogs that the user can view. If no catalog is
     * available, null is returned.
     * @returns Object pointing to the earliest catalog that the user can view.
     * @example var catalog = sn_sc.Catalog. getAvailableCatalog()
     */
    getAvailableCatalog() {}
    /**
     * Returns the catalog background color.
     * @returns Background color of the catalog.
     * @example var catalog=new sn_sc.Catalog("e0d08b13c3330100c8b837659bba8fb4");
     * console.log(catalog.getBackgroundColor());
     */
    getBackgroundColor() {}
    /**
     * Specifies the number of catalogs active in the catalog table.
     * @returns Number of catalogs available in the catalog table.
     * @example console.log (sn_sc.Catalog.getCatalogCount());
     */
    getCatalogCount() {}
    /**
     * Returns the categories for the specified catalog.
     * @returns Returns the categories for the specified catalog.
     * @example var catalog=new sn_sc.Catalog("e0d08b13c3330100c8b837659bba8fb4");
     * console.log(catalog.getCategories());
     */
    getCategories() {}
    /**
     * Specifies the sys_ids of the categories in the specified catalog.
     * @returns Returns the sys_ids of the categories in the specified catalog.
     * @example var catalog=new sn_sc.Catalog("e0d08b13c3330100c8b837659bba8fb4");
     * console.log(catalog.getCategoryIds());
     */
    getCategoryIds() {}
    /**
     * Specifies the catalog description.
     * @returns Catalog description.
     * @example var catalog=new sn_sc.Catalog("e0d08b13c3330100c8b837659bba8fb4");
     * console.log(catalog.getDescription());
     */
    getDescription() {}
    /**
     * Returns the catalog desktop image value.
     * @returns Catalog desktop image value.
     * @example var catalog=new sn_sc.Catalog("e0d08b13c3330100c8b837659bba8fb4");
     * console.log(catalog.getDesktopImageSRC());
     */
    getDesktopImageSRC() {}
    /**
     * Returns the catalog gliderecord.
     * @returns GlideRecord of the catalog.
     * @example var catalog=new sn_sc.Catalog("e0d08b13c3330100c8b837659bba8fb4");
     * data.history=catalog.getGr();
     */
    getGr() {}
    /**
     * Returns the catalog header icon.
     * @returns Catalog header icon.
     * @example var catalog=new sn_sc.Catalog("e0d08b13c3330100c8b837659bba8fb4");
     * console.log(catalog.getHeaderIconSRC());
     */
    getHeaderIconSRC() {}
    /**
     * Specifies the sys_id of the catalog.
     * @returns sys_id of the catalog.
     * @example var catalog=new sn_sc.Catalog("e0d08b13c3330100c8b837659bba8fb4");
     * console.log(catalog.getId());
     */
    getID() {}
    /**
     * Returns the title of the catalog.
     * @returns Title of the catalog
     * @example var catalog=new sn_sc.Catalog("e0d08b13c3330100c8b837659bba8fb4");
     * console.log(catalog.getTitle());
     */
    getTitle() {}
    /**
     * Specifies if the catalog has categories.
     * @returns Returns true if the catalog has categories. Else returns false.
     * @example var catalog=new sn_sc.Catalog("e0d08b13c3330100c8b837659bba8fb4");
     * console.log(catalog.hasCategories());
     */
    hasCategories() {}
    /**
     * Specifies if the catalog has catalog items.
     * @returns Returns true if the catalog has catalog items. Else returns false.
     * @example var catalog=new sn_sc.Catalog("e0d08b13c3330100c8b837659bba8fb4");
     * console.log(catalog.hasItems());
     * 
     */
    hasItems() {}
    /**
     * Specifies if the wish list is enabled for a catalog.
     * @returns Returns true if wish list is enabled for a catalog. Else returns false.
     * @example var catalog=new sn_sc.Catalog("e0d08b13c3330100c8b837659bba8fb4");
     * console.log(catalog.isWishlistEnabled());
     * 
     */
    isWishlistEnabled() {}
}