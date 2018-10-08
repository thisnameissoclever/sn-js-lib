/**
 * CartJS API enables you to access the shopping cart for a user. To
 * use this class in a scoped application, use the sn_sc namespace identifier. The Service Catalog
 * Scoped API plugin (ID: com.glideapp.servicecatalog.scoped.api) that is enabled by default is
 * required to access the CartJS API.
 * @class CartJS
 * @typedef {Object}  CartJS
 */
class CartJS {
    /**
     * Creates an instance of the CartJS class for the default cart of the user who is
     * currently logged in.
     */
    constructor() {}
    /**
     * Adds the request for a catalog item to the current cart.
     * @param {Map} request A JSON object that contains the details of the catalog item to be added to the
     * cart.The structure of the request object
     * is:
     * {
     * 'sysparm_id': item_id,
     * 'sysparm_quantity': item_quantity,
     * 'variables':{
     * 'var_name': 'var_value',
     * ...
     * }
     * }
     * item_id: sys_id of the item to be added to the cart
     * item_quantity: Number of items to be added. Default value is 1.
     * var_name: Name of the question.
     * var_value: Value of the answer (Not the display value).
     * 
     * @returns Structure of the current
     * cart.{
     * 'subtotal': value,
     * 'items':[
     * {
     * itemName:'',
     * quantity:'',
     * price:'',
     * recurring_price:''
     * } ...]
     * }
     * @example 
     * var cart = new sn_sc.CartJS();
     * var item =
     * {
     * 'sysparm_id': '0d08837237153000158bbfc8bcbe5d02',
     * 'sysparm_quantity': '1',
     * 'variables':{
     * 'carrier': 'at_and_t_mobility',
     * 'data_plan': '500MB',
     * 'duration': 'eighteen_months',
     * 'color': 'slate',
     * 'storage': 'sixtyfour'
     * }};
     * var cartDetails = cart.addToCart(item);
     * gs.info(cartDetails);
     */
    addToCart(request) {}
    /**
     * Specifies if the current user has the required role to edit the Request
     * for field.
     * @returns Returns true if the user has the required role to edit the requested for
     * field.
     * @example var cart=new sn_sc.CartJS();
     * console.log(cart.canViewRF());
     */
    canViewRF() {}
    /**
     * Performs the cart checkout. If the two-step checkout is enabled, returns the order
     * summary. If the two-step checkout is disabled, the cart is submitted and details of the
     * generated request are returned.
     * @returns If the two-step checkout is enabled, the summary of the items in the cart is
     * returned.{ "subtotal_price":"",
     * "subtotal_recurring_frequency":"",
     * "delivery_address":"",
     * "special_instructions":"",
     * "total_title":"",
     * "requested_for_user":"System Administrator",
     * "requested_for":"6816f79cc0a8016401c5a33be04be441",
     * “daily”: ["frequency_subtotal":"", "items":[{}, {}, ...], …],
     * “monthly”:["frequency_subtotal":"", "items":[{}, {}, ...], …],
     * “annually”:["frequency_subtotal":"", "items":[{}, {}, ...], …],
     * "none":["frequency_subtotal":"", "items":[{}, {}, ...], …],
     * }
     * If
     * the two-step checkout is
     * disabled:{
     * 'request_id' : "sys_id of the generated request",
     * "request_number" : "Number of the generated request"
     * }
     * 
     * @example var cart = new sn_sc.CartJS();
     * var checkoutInfo = cart.checkoutCart();
     * gs.info(checkoutInfo);
     * 
     */
    checkoutCart() {}
    /**
     * Deletes the current cart.
     * @returns Method does not return a value
     * @example var cart = new sn_sc.CartJS();
     * cart.empty();
     */
    empty() {}
    /**
     * Returns the cart details.
     * @returns Object pointing to the current cart details.
     * @example var cart=new sn_sc.CartJS();
     * console.log (cart.getCartDetails());
     */
    getCartDetails() {}
    /**
     * Returns the cart id of the current cart.
     * @returns sys_id for the current cart.
     * @example 
     * var cart = new sn_sc.CartJS();
     * cart.getCartID();
     * gs.info(cartId);
     * 
     */
    getCartID() {}
    /**
     * Returns the GlideRecord for the cart item (sc_cart_item) in the current
     * cart.
     * @returns GlideRecord pointing to cart items in the current cart.
     * @example 
     * var cart = new sn_sc.CartJS();
     * cart.getCartItems();
     * gs.info(CartItems)
     * 
     */
    getCartItems() {}
    /**
     * Gets the delivery address for the current cart.
     * @returns Delivery address for the current cart.
     * @example 
     * var cart = new sn_sc.CartJS();
     * cart.setDeliveryAddress("Brasilia, Brasil");
     * cart.getDeliveryAddress();
     * gs.info(DeliveryAddress);
     * 
     */
    getDeliveryAddress() {}
    /**
     * Gets the sys_id from the sys_user record of the user for whom the cart is
     * requested.
     * @returns sys_id from the sys_user record of the user for whom the cart is
     * requested.
     * @example 
     * var cart = new sn_sc.CartJS();
     * cart.setRequestedFor("039c516237b1300054b6a3549dbe5dfc")
     * cart.getRequestedFor();
     * gs.info(cartId);
     * 
     */
    getRequestedFor() {}
    /**
     * Gets the name from the user record of the user for whom the current cart is
     * requested.
     * @returns Name from the user record of the user for whom the current cart is
     * requested.
     * @example 
     * var cart = new sn_sc.CartJS();
     * cart.getRequestedForDisplayName();
     * gs.info(DisplayName);
     * 
     */
    getRequestedForDisplayName() {}
    /**
     * Gets the special instructions for the current cart.
     * @returns Special instructions for the current cart.
     * @example 
     * var cart = new sn_sc.CartJS();
     * cart.setSpecialInstructions("Delivery before 8 AM.");
     * cart.getSpecialInstructions();
     * gs.info(SpecialInstructions);
     * 
     */
    getSpecialInstructions() {}
    /**
     * Orders a single item. If the two-step checkout is enabled, the item is added to the
     * cart and the cart sys_id is returned. If the two-step checkout is disabled, the item is ordered
     * and the generated request sys_id and number is returned.
     * @param {Map} request A JSON object  that contains details of the catalog item to be ordered.The
     * structure of the request object
     * is:
     * {
     * 'sys_id' : item_id,
     * 'sysparm_quantity' : item_quantity,
     * 'sysparm_requested_for' : requested_for,
     * 'variables' : {
     * 'var_name' : 'var_value',
     * ...
     * }
     * }
     * item_id: sys_id of the item to be added to the cart. Required.
     * item_quantity: Number of items to be added. Default value is 1.
     * var_name: Name of the question.
     * var_value: Value of the answer (Not the display value).
     * 
     * @returns If the two-step checkout is
     * enabled:{
     * 'cart_id' : 'sys_id of cart that item has been added to'
     * }
     * If
     * the two-step checkout is
     * disabled:
     * {
     * 'request_id' : 'sys_id of the generated request',
     * 'request_number' : 'Number of the generated request'
     * }
     * @example 
     * var cart = new sn_sc.CartJS();
     * var request =
     * {
     * 'sysparm_id': '0d08837237153000158bbfc8bcbe5d02',
     * 'sysparm_quantity': '1',
     * 'variables':{
     * 'carrier': 'at_and_t_mobility',
     * 'data_plan': '500MB',
     * 'duration': 'eighteen_months',
     * 'color': 'slate',
     * 'storage': 'sixtyfour'
     * }
     * }
     * var cartDetails = cart.orderNow(request);
     * gs.info(cartDetails);
     */
    orderNow(request) {}
    /**
     * Sets the delivery address for the current cart.
     * @param {String} address Delivery address for the current cart.
     * @returns Method does not return a value
     * @example 
     * var cart = new sn_sc.CartJS();
     * cart.setDeliveryAddress("Brasilia, Brasil");
     * 
     */
    setDeliveryAddress(address) {}
    /**
     * Sets the sys_id in the sys_user record of the user for whom the cart is
     * requested.
     * @param {String} user sys_id to be set in the sys_user record of the user for whom the cart is
     * requested.
     * @returns Method does not return a value
     * @example 
     * var cart = new sn_sc.CartJS();
     * cart.setRequestedFor("039c516237b1300054b6a3549dbe5dfc")
     * 
     */
    setRequestedFor(user) {}
    /**
     * Sets the special instructions for the current cart.
     * @param {String} specialInstructions Special instructions for the current cart.
     * @returns Method does not return a value
     * @example 
     * var cart = new sn_sc.CartJS();
     * cart.setSpecialInstructions("Delivery before 8 AM.");
     * 
     */
    setSpecialInstructions(specialInstructions) {}
    /**
     * Updates special instructions, requested for, and delivery address from the
     * request parameter and performs the cart checkout. Use this API to modify
     * the mentioned parameters of the cart and perform the cart checkout simultaneously. Missing
     * parameters in the request object will have their default value.
     * @param {Map} request A JSON object that contains details of the cart to be submitted.The
     * structure of the request object
     * is:
     * {
     * 'special_instructions' : 'instructions',
     * 'sysparm_requested_for' : requested_for,
     * 'delivery_address' : 'address'
     * }
     * instructions: Special instructions for the request.
     * requested_for : sys_id of the requested_for user.
     * address: Delivery address for the request.
     * 
     * @returns Structure of the
     * cart.{
     * 'request_id' : 'sys_id of the generated Request',
     * 'request_number' : 'Number of the generated Request'
     * }
     * @example var cart = new sn_sc.CartJS();
     * var request =
     * {
     * 'special_instructions' : 'Delivery only in working hours',
     * 'requested_for' : '62826bf03710200044e0bfc8bcbe5df1',
     * 'delivery_address' : "Brasilia, Brasil",
     * };
     * var requestDetails = cart.submitOrder(request);
     * gs.info(requestDetails);
     */
    submitOrder(request) {}
    /**
     * Updates an item in the cart.
     * @param {Map} request A JSON object that contains details of the catalog item to be updated.The
     * structure of the request object
     * is:
     * {
     * 'sysparm_quantity' : item_quantity,
     * 'sysparm_requested_for' : requested_for,
     * 'variables' : {
     * 'var_name' : 'var_value',
     * ...
     * }
     * }
     * item_quantity: Number of items to be added. Default value is 1.
     * var_name: Name of the question.
     * var_value: Value of the answer (Not the display value).
     * 
     * @param {String} cart_item_id sys_id of the cart item to be modified.
     * @returns Details of the
     * cart.{
     * 'subtotal': value,
     * 'items':[
     * {
     * itemName:'',
     * quantity:'',
     * price:'',
     * recurring_price:''
     * }
     * ...],
     * ...
     * }
     * @example var cart = new sn_sc.CartJS();
     * var request =
     * {
     * 'sysparm_quantity': '1',
     * 'variables':{
     * 'carrier': 'at_and_t_mobility',
     * 'data_plan': '500MB',
     * 'duration': 'eighteen_months',
     * 'color': 'slate',
     * 'storage': 'sixtyfour'
     * }
     * };
     * var cart_item_id = "4d69b672c322320076173b0ac3d3ae79";
     * var cartDetails = cart.updateItem(request, cart_item_id);
     * gs.info(cartDetails);
     * 
     */
    updateItem(request, cart_item_id) {}
}