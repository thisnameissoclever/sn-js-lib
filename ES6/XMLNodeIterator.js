/**
 * The scoped XMLNodeIterator class allows you to iterate through a node of a XML
 * document.
 * @class XMLNodeIterator
 * @typedef {Object}  XMLNodeIterator
 */
class XMLNodeIterator {
    constructor() {}
    /**
     * Returns true if the iteration has more elements.
     * @returns True if the iteration has more elements.
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
    hasNext() {}
    /**
     * Gets the next element in the iteration. The returned element may be a #text node for
     * the spaces/tabs if XML is "pretty formatted".
     * @returns The next element in the iteration.
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
     * while(iter.hasNext()) {
     * var n = iter.next();
     * gs.info('Node name: ' +  n.getNodeName());
     * gs.info('Node value: ' +  n.getNodeValue());
     * }
     */
    next() {}
}