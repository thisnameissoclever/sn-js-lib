/**
 * CatalogSearch API enables you to search catalog item. To use this
 * class in a scoped application, use the sn_sc namespace identifier. The Service Catalog Scoped
 * API plugin (ID: com.glideapp.servicecatalog.scoped.api) that is enabled by default is required
 * to access the CatalogSearch API.
 * @class CatalogSearch
 * @typedef {Object}  CatalogSearch
 */
class CatalogSearch {
    /**
     * Creates an instance of the CatalogSearch class.
     */
    constructor() {}
    /**
     * Searches a catalog item based on a search term. The search can be narrowed down to a
     * catalog category level.
     * @param {String} catalogID Identifier of the catalog that is searched.
     * @param {String} categoryID Identifier of the catalog category that is searched.
     * @param {String} term Search term.
     * @param {Boolean} mobile If true, only catalog items exposed for mobile are searched.
     * @param {Boolean} depthSearch If true,  subcategories are also searched.
     * @returns Returns the GlideRecord on sc_cat_item matching the search result.
     * @example 
     * var gr = new sn_sc.CatalogSearch().search('', '', 'Apple', false, true);
     * gr.query()
     * while(var gr = new sn_sc.CatalogSearch().search('', '', 'Apple', false, true);
     * gr.query()
     * while(gr.next()) {
     * gs.log(gr.name)
     * })
     */
    search(catalogID, categoryID, term, mobile, depthSearch) {}
}