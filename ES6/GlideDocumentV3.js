/**
 * The GlideDocument class provides the ability to search a DOM element, a document, or a
 * JQuery element.
 * @class GlideDocumentV3
 * @typedef {Object}  GlideDocumentV3
 */
class GlideDocumentV3 {
    constructor() {}
    /**
     * Returns a node found in the specified DOM based context or created from the HTML
     * context.
     * @param {String or Object} selector The selector expression
     * @param {String or Object} context (Optional) A DOM Element, document, or JQuery object to be searched.
     * @returns The node that matches the selector.
     */
    getElement(selector, context) {}
    /**
     * Returns a node list found in the specified DOM based context or created if an HTML
     * context is specified.
     * @param {String or Object} selector The selector expression
     * @param {String or Object} context (Optional) A DOM Element, document, or JQuery object to be searched.
     * @returns A list of nodes that matches the selector.
     */
    getElements(selector, context) {}
}