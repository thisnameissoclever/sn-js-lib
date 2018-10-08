/**
 * The GlideURI class is a utility class for handling the URI parameter. The GlideURI class
 * is available in scoped and global scripts.
 * @class GlideURI
 * @typedef {Object}  GlideURI
 */
class GlideURI {
    /**
     * Instantiates a GlideURI object.
     */
    constructor() {}
    /**
     * Returns the specified parameter.
     * @param {String} name The parameter name.
     * @returns The URI for the specified parameter.
     * @example var gURI = new GlideURI();
     * gURI.set('sysparm_query', 'priority=2^active=true' );
     * var fileString = gURI.get('sysparm_query');
     * gs.info(fileString);
     */
    get(name) {}
    /**
     * Returns the file name portion of the URI.
     * @returns The file name portion of the URI.
     * @example var gURI = new GlideURI();
     * var fileString = gURI.getFileFromPath();
     * gs.info(fileString);
     */
    getFileFromPath() {}
    /**
     * Sets the specified parameter to the specified value.
     * @param {String} name The parameter name.
     * @param {String} value The value.
     * @returns Method does not return a value
     * @example var gURI = new GlideURI();
     * gURI.set('sysparm_query', 'priority=2^active=true' );
     * var fileString = gURI.get('sysparm_query');
     * gs.info(fileString);
     */
    set(name, value) {}
    /**
     * Reconstructs the URI string and performs the proper URL encoding by converting
     * non-valid characters to their URL code. For example, converting & to '%26'.
     * @param {String} path The base portion of the system URL to which the URI is appended.
     * @returns The URL.
     * @example fileString = gURI.toString('https://&lt;your instance&gt;.service-now.com/navpage.do');
     */
    toString(path) {}
}