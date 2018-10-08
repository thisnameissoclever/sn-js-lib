/**
 * The RenderProperties API provides methods about the current page and is available in
 * Jelly scripts and in UI-action conditions and scripts.
 * @class RenderProperties
 * @typedef {Object}  RenderProperties
 */
class RenderProperties {
    constructor() {}
    /**
     * Returns the encoded query from the URL sent to the page.
     * @returns Returns the encoded query from the URL sent to the form.
     */
    getEncodedQuery() {}
    /**
     * Returns the list control object for the page.
     * @returns The list control object for the page.
     */
    getListControl() {}
    /**
     * Returns the value of the specified URL parameter.
     * @param {String} parameterName Name of the parameter passed on the URL.
     * @returns The parameter's value.
     */
    getParameterValue(parameterName) {}
    /**
     * Returns the URL where the request originated.
     * @returns The URL of the page where the request originated.
     */
    getReferringURL() {}
    /**
     * Returns the name of the view in use.
     * @returns The name of the view being used.
     */
    getViewName() {}
    /**
     * Returns the window's properties.
     * @returns The window's properties
     */
    getWindowProperties() {}
    /**
     * Returns true if the page is part of Studio.
     * @returns Returns true if the page is part of Studio.
     */
    isInDevStudio() {}
    /**
     * Returns true if this is an interactive session. An interactive session is when a user
     * has logged in as opposed to a REST request.
     * @returns True if this is an interactive session.
     */
    isInteractive() {}
    /**
     * Returns true when the sysparm_collection_related_file URL parameter is
     * set.
     * @returns Returns true when the sysparm_collection_related_file URL
     * parameter is set.
     */
    isManyToMany() {}
    /**
     * Returns true when the sys_is_related_list URL-parameter is true.
     * Returns false if the parameter is not present.
     * @returns True if the URL parameter sys_is_related_list is true.
     */
    isRelatedList() {}
}