/**
 * The scoped XMLNode API allows you to query values from XML nodes. XMLNodes are extracted
 * from XMLDocument2 objects, which contain XML strings.
 * @class XMLNode
 * @typedef {Object}  XMLNode
 */
class XMLNode {
    constructor() {}
    /**
     * Gets the value of the attribute.
     * @param {String} attribute Name of the attribute.
     * @returns The attribute's value.
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
     * var node = xmlDoc.getNode('//two');
     * gs.info(node.getAttribute('att'));
     */
    getAttribute(attribute) {}
    /**
     * Returns an object containing the node's attributes as properties with
     * values.
     * @returns Contains name-value pairs where the name is the attribute and the value is the
     * attribute's value.
     */
    getAttributes() {}
    /**
     * Gets a XMLNodeIterator object that can be used to walk through the list of child
     * nodes.
     * @returns The node iterator object.
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
     * var node = xmlDoc.getNode('//one');
     * var iter= node.getChildNodeIterator();
     * gs.info(iter.hasNext());
     */
    getChildNodeIterator() {}
    /**
     * Gets the node's first child node.
     * @returns The node's first child node.
     * @example var xmlString = "&lt;test&gt;" +
     * "&lt;one&gt;" +
     * "&lt;two att=\"xxx\"&gt;abcd1234&lt;/two&gt;" +
     * "&lt;three boo=\"yah\" att=\"yyy\"&gt;1234abcd&lt;/three&gt;" +
     * "&lt;two&gt;another&lt;/two&gt;" +
     * "&lt;/one&gt;" +
     * "&lt;number&gt;1234&lt;/number&gt;" +
     * "&lt;/test&gt;";
     * var xmlDoc = new XMLDocument2();
     * xmlDoc.parseXML(xmlString);
     * var node = xmlDoc.getNode('//one');
     * gs.info(node.getFirstChild());
     */
    getFirstChild() {}
    /**
     * Gets the node's last child node.
     * @returns The node's last child.
     * @example var xmlString = "&lt;test&gt;" +
     * "&lt;one&gt;" +
     * "&lt;two att=\"xxx\"&gt;abcd1234&lt;/two&gt;" +
     * "&lt;three boo=\"yah\" att=\"yyy\"&gt;1234abcd&lt;/three&gt;" +
     * "&lt;two&gt;another&lt;/two&gt;" +
     * "&lt;/one&gt;" +
     * "&lt;number&gt;1234&lt;/number&gt;" +
     * "&lt;/test&gt;";
     * var xmlDoc = new XMLDocument2();
     * xmlDoc.parseXML(xmlString);
     * var node = xmlDoc.getNode('//one');
     * gs.info(node.getLastChild());
     */
    getLastChild() {}
    /**
     * Gets the node's name. A node's name is determined by the node type. A document-element
     * node's name is #document. A text node's name is #text. An element node's name is the element's
     * name.
     * @returns The node's name.
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
     * var node = xmlDoc.getNode('//two');
     * gs.info(node.getNodeName());
     */
    getNodeName() {}
    /**
     * Gets the node's value. A node's value is determined by the node type. Element and
     * document-element nodes return null.
     * @returns The node's value.
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
     * var node = xmlDoc.getNode('//two');
     * gs.info(node.getNodeValue());
     */
    getNodeValue() {}
    /**
     * Gets the text content of the current node. The text content of a node consists of all
     * the node's child text nodes
     * @returns The text content of the current node.
     * @example var xmlString = "&lt;test&gt;" +
     * "  &lt;one&gt;" +
     * "    &lt;two att=\"xxx\"&gt;abcd1234&lt;/two&gt;" +
     * "    &lt;three boo=\"yah\" att=\"yyy\"&gt;1234abcd&lt;/three&gt;" +
     * "    &lt;two&gt;another&lt;/two&gt;" +
     * "  &lt;/one&gt;" +
     * "  &lt;number&gt;1234&lt;/number&gt;" +
     * "&lt;/test&gt;";
     * var xmldoc = new XMLDocument2();
     * xmldoc.parseXML(xmlString);
     * var node = xmldoc.getNode('//one/two');
     * gs.info(node.getTextContent());
     */
    getTextContent() {}
    /**
     * Determines if the node has the specified attribute.
     * @param {String} attribute The name of the attribute to check.
     * @returns True if the node has the attribute.
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
     * var node = xmlDoc.getNode('//two');
     * gs.info(node.hasAttribute('att'));
     */
    hasAttribute(attribute) {}
    /**
     * Returns the string value of the current node.
     * @returns The string value of the current node.
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
     * var node = xmlDoc.getNode('//one');
     * gs.info(node.toString());
     */
    toString() {}
}