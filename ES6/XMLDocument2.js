/**
 * XMLDocument2 is a JavaScript Object wrapper for parsing and extracting XML data from an
 * XML string.
 * @class XMLDocument2
 * @typedef {Object}  XMLDocument2
 */
class XMLDocument2 {
    /**
     * Creates an XMLDocument2 object from an attachment stream.
     * @param {GlideScriptableInputStream} inputStream The input stream the XMLDocument2 object encapsulates.
     */
    constructor(inputStream) {}
    /**
     * Creates and adds an element node to the current node. The element name is the string
     * passed in as a parameter. The new element has no text child nodes.
     * @param {String} name The new element's name.
     * @returns Method does not return a value
     * @example var xmlString = "&lt;test&gt;" +
     * "  &lt;one&gt;" +
     * "    &lt;two att=\"xxx\"&gt;abcd1234&lt;/two&gt;" +
     * "    &lt;three boo=\"yah\" att=\"yyy\"&gt;1234abcd&lt;/three&gt;" +
     * "    &lt;two&gt;another&lt;/two&gt;" +
     * "  &lt;/one&gt;" +
     * "  &lt;number&gt;1234&lt;/number&gt;" +
     * "&lt;/test&gt;";
     * var xmlDoc = new XMLDocument2();
     * xmlDoc.parseXML(xmlString);
     * xmlDoc.createElement("new2");
     * gs.info(xmlDoc);
     */
    createElement(name) {}
    /**
     * Creates and adds an element node with a text child node to the current
     * node.
     * @param {String} name Name of the element to be added.
     * @param {String} value The added element's text value.
     * @returns The current node.
     * @example var xmlString = "&lt;test&gt;" +
     * "  &lt;one&gt;" +
     * "    &lt;two att=\"xxx\"&gt;abcd1234&lt;/two&gt;" +
     * "    &lt;three boo=\"yah\" att=\"yyy\"&gt;1234abcd&lt;/three&gt;" +
     * "    &lt;two&gt;another&lt;/two&gt;" +
     * "  &lt;/one&gt;" +
     * "  &lt;number&gt;1234&lt;/number&gt;" +
     * "&lt;/test&gt;";
     * var xmlDoc = new XMLDocument2();
     * xmlDoc.parseXML(xmlString);
     * xmlDoc.createElementWithTextValue("new", "test");
     * gs.info(xmlDoc);
     */
    createElementWithTextValue(name, value) {}
    /**
     * Gets the document element node of the XMLdocument2 object. The document element node is
     * the root node.
     * @returns The document element.
     * @example var xmlString = "&lt;test&gt;" +
     * "  &lt;one&gt;" +
     * "    &lt;two att=\"xxx\"&gt;abcd1234&lt;/two&gt;" +
     * "    &lt;three boo=\"yah\" att=\"yyy\"&gt;1234abcd&lt;/three&gt;" +
     * "    &lt;two&gt;another&lt;/two&gt;" +
     * "  &lt;/one&gt;" +
     * "  &lt;number&gt;1234&lt;/number&gt;" +
     * "&lt;/test&gt;";
     * var xmlDoc = new XMLDocument2();
     * xmlDoc.parseXML(xmlString);
     * //returns the root node of the document tree.
     * var rootNode = xmlDoc.getDocumentElement();
     * gs.info(rootNode.getTextContent());
     */
    getDocumentElement() {}
    /**
     * Gets the first node in the specified XPATH.
     * @param {String} xPath The XPATH.
     * @returns The first node.
     * @example var xmlString = "&lt;test&gt;" +
     * "  &lt;one&gt;" +
     * "    &lt;two att=\"xxx\"&gt;abcd1234&lt;/two&gt;" +
     * "    &lt;three boo=\"yah\" att=\"yyy\"&gt;1234abcd&lt;/three&gt;" +
     * "    &lt;two&gt;another&lt;/two&gt;" +
     * "  &lt;/one&gt;" +
     * "  &lt;number&gt;1234&lt;/number&gt;" +
     * "&lt;/test&gt;";
     * var xmlDoc = new XMLDocument2();
     * xmlDoc.parseXML(xmlString);
     * var foo = xmlDoc.getFirstNode('/test/one/two');
     * gs.info(foo.getTextContent());
     */
    getFirstNode(xPath) {}
    /**
     * Gets the node after the specified node.
     * @param {Object} current The current node.
     * @returns The next node.
     * @example var xmlString = "&lt;test&gt;" +
     * "  &lt;one&gt;" +
     * "    &lt;two att=\"xxx\"&gt;abcd1234&lt;/two&gt;" +
     * "    &lt;three boo=\"yah\" att=\"yyy\"&gt;1234abcd&lt;/three&gt;" +
     * "    &lt;two&gt;another&lt;/two&gt;" +
     * "  &lt;/one&gt;" +
     * "  &lt;number&gt;1234&lt;/number&gt;" +
     * "&lt;/test&gt;";
     * var xmlDoc = new XMLDocument2();
     * xmlDoc.parseXML(xmlString);
     * var foo = xmlDoc. getFirstNode('/test/one/two');
     * var foo2 = xmlDoc.getNextNode(foo);
     * gs.info(foo.getTextContent());
     * gs.info(foo2.getTextContent());
     */
    getNextNode(current) {}
    /**
     * Gets the node specified in the xpath.
     * @param {String} xPath The xpath
     * @returns The current node.
     * @example var xmlString = "&lt;test&gt;" +
     * "  &lt;one&gt;" +
     * "    &lt;two att=\"xxx\"&gt;abcd1234&lt;/two&gt;" +
     * "    &lt;three boo=\"yah\" att=\"yyy\"&gt;1234abcd&lt;/three&gt;" +
     * "    &lt;two&gt;another&lt;/two&gt;" +
     * "  &lt;/one&gt;" +
     * "  &lt;number&gt;1234&lt;/number&gt;" +
     * "&lt;/test&gt;";
     * var xmlDoc = new XMLDocument2();
     * xmlDoc.parseXML(xmlString);
     * var node = xmlDoc.getNode("/test/one/two");
     * gs.info(node);
     */
    getNode(xPath) {}
    /**
     * Gets all the text child nodes from the node referenced in the xpath.
     * @param {String} xPath the xpath.
     * @returns The text children in the xpath.
     * @example var xmlString = "&lt;test&gt;" +
     * "  &lt;one&gt;" +
     * "    &lt;two att=\"xxx\"&gt;abcd1234&lt;/two&gt;" +
     * "    &lt;three boo=\"yah\" att=\"yyy\"&gt;1234abcd&lt;/three&gt;" +
     * "    &lt;two&gt;another&lt;/two&gt;" +
     * "  &lt;/one&gt;" +
     * "  &lt;number&gt;1234&lt;/number&gt;" +
     * "&lt;/test&gt;";
     * var xmlDoc = new XMLDocument2();
     * xmlDoc.parseXML(xmlString);
     * gs.info(xmlDoc.getNodeText("//two"));
     */
    getNodeText(xPath) {}
    /**
     * Parses the XML string and loads it into the XMLDocument2 object.
     * @param {String} xmlDoc The document to parse.
     * @returns Method does not return a value
     * @example var xmlString = "&lt;test&gt;" +
     * "  &lt;one&gt;" +
     * "    &lt;two att=\"xxx\"&gt;abcd1234&lt;/two&gt;" +
     * "    &lt;three boo=\"yah\" att=\"yyy\"&gt;1234abcd&lt;/three&gt;" +
     * "    &lt;two&gt;another&lt;/two&gt;" +
     * "  &lt;/one&gt;" +
     * "  &lt;number&gt;1234&lt;/number&gt;" +
     * "&lt;/test&gt;";
     * var xmlDoc = new XMLDocument2();
     * xmlDoc.parseXML(xmlString);
     * var rootNode = xmlDoc.getDocumentElement();
     */
    parseXML(xmlDoc) {}
    /**
     * Makes the node passed in as a parameter the current node.
     * @param {XMLNode} element The element node to set as the current node.
     * @returns Method does not return a value
     * @example var xmlString = "&lt;test&gt;" +
     * "  &lt;one&gt;" +
     * "    &lt;two att=\"xxx\"&gt;abcd1234&lt;/two&gt;" +
     * "    &lt;three boo=\"yah\" att=\"yyy\"&gt;1234abcd&lt;/three&gt;" +
     * "    &lt;two&gt;another&lt;/two&gt;" +
     * "  &lt;/one&gt;" +
     * "  &lt;number&gt;1234&lt;/number&gt;" +
     * "&lt;/test&gt;";
     * var xmlDoc = new XMLDocument2();
     * xmlDoc.parseXML(xmlString);
     * //returns the root node of the document tree.
     * var rootNode = xmlDoc.getDocumentElement(); //returns org.w3c.dom.Element
     * // sets the root node as the current element
     * xmlDoc.setCurrentElement(rootNode);
     */
    setCurrentElement(element) {}
    /**
     * When set to true, the XMLDocument2 object processes the document with XML
     * namespaces.
     * @param {Boolean} aware When true, the XMLDocument2 object processes the document with XML namespaces.
     * @returns Method does not return a value
     */
    setNamespaceAware(aware) {}
    /**
     * Returns a string containing the XML.
     * @returns A string containing the XML.
     * @example var xmlString = "&lt;test&gt;" +
     * "  &lt;one&gt;" +
     * "    &lt;two att=\"xxx\"&gt;abcd1234&lt;/two&gt;" +
     * "    &lt;three boo=\"yah\" att=\"yyy\"&gt;1234abcd&lt;/three&gt;" +
     * "    &lt;two&gt;another&lt;/two&gt;" +
     * "  &lt;/one&gt;" +
     * "  &lt;number&gt;1234&lt;/number&gt;" +
     * "&lt;/test&gt;";
     * var xmlDoc = new XMLDocument2();
     * xmlDoc.parseXML(xmlString);
     * gs.info(xmlDoc.toString());
     */
    toString() {}
}