/**
 * OrderGuide API enables you to initialize and view an order guide
 * details. To use this class in a scoped application, use the sn_sc namespace identifier. The
 * Service Catalog Scoped API plugin (com.glideapp.servicecatalog.scoped.api) that is enabled by
 * default is required to access the OrderGuide API.
 * @class OrderGuide
 * @typedef {Object}  OrderGuide
 */
class OrderGuide {
    /**
     * Creates an instance of the OrderGuide class with the specified sys_id.
     * @param {String} sys_id sys_id of the OrderGuide.
     */
    constructor(sys_id) {}
    /**
     * Returns the sys_id of the order guide.
     * @returns sys_id of the order guide.
     * @example var cart=new sn_sc.OrderGuide("6690750f4f7b4200086eeed18110c761");
     * console.log(cart.getID());
     * 
     */
    getID() {}
    /**
     * Initialises the order guide with the specified catalog items and the variables, and
     * returns the order guide.
     * @param {Map} request A JSON object with the Catalog item and variable details.
     * @returns A JSON object with the initialised order guide details.
     * @example var guide = new sn_sc.OrderGuide('6690750f4f7b4200086eeed18110c761');
     * var map = {};
     * map.variables = {};
     * //map.sysparm_id = '6690750f4f7b4200086eeed18110c761';
     * map.variables['IOce433d0f4f7b4200086eeed18110c74d'] = '221f3db5c6112284009f4becd3039cc9'; //Here ce433d0f4f7b4200086eeed18110c74d is the sys_id of the variable and 221f3db5c6112284009f4becd3039cc9 is its value
     * var includedItems = guide.init(map)
     */
    init(request) {}
    /**
     * Specifies if the Include items check box is selected for the
     * specified order guide.
     * @returns Returns true if the Include items check box is selected
     * for the specified order guide. Else, returns false.
     * @example var orderGuide=new sn_sc.OrderGuide("6690750f4f7b4200086eeed18110c761");
     * console.log(orderGuide.isIncludeItems());
     */
    isIncludeItems() {}
    /**
     * Specifies if the two-step checkout is enabled.
     * @returns Returns true if the two-step checkout is enabled. Else returns false.
     * @example var orderGuide=new sn_sc.OrderGuide("6690750f4f7b4200086eeed18110c761");
     * console.log(orderGuide.isTwoStep());
     */
    isTwoStep() {}
    /**
     * Specifies if a separate cart (different from that for catalog items) usage is enabled
     * for a two-step order guide.
     * @returns Returns true if a separate cart usage is enabled for a two-step order guide.
     * Else, returns false.
     * @example var orderGuide=new sn_sc.OrderGuide("6690750f4f7b4200086eeed18110c761");
     * console.log (orderGuide.isUseCustomCart());
     */
    isUseCustomCart() {}
    /**
     * Navigates to the catalog items of an order guide.
     * @param {Map} itemDetails A JSON object with details of catalog items in the order guide.
     * @returns Method does not return a value
     * @example var orderGuide=new sn_sc.OrderGuide.navigateFromMap(itemdetails);
     */
    navigateFromMap(itemDetails) {}
}