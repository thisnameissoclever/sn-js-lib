/**
 * The scoped GlideElementDescriptor API provides information about individual
 * fields.
 * @class GlideElementDescriptor
 * @typedef {Object}  GlideElementDescriptor
 */
class GlideElementDescriptor {
    constructor() {}
    /**
     * Returns the encryption type used for attachments on the element's table.
     * @returns The encryption type used on attachments. Returns null if attachments on the
     * element's table are not being encrypted.
     * @example var grInc = new GlideRecord('incident');
     * grInc.query('priority', '1');
     * var field = grInc.getElement('priority');
     * var ed = field.getED();
     * var isEdge = ed.getAttachmentEncryptionType();
     * gs.info(isEdge);
     * 
     */
    getAttachmentEncryptionType() {}
    /**
     * Returns the element's encryption type.
     * @returns The element's encryption type. Returns null if the element is not
     * encrypted.
     * @example var grInc = new GlideRecord('incident');
     * grInc.query('priority', '1');
     * var field = grInc.getElement('priority');
     * var ed = field.getED();
     * sEdge = ed.getEncryptionType();
     * gs.info(isEdge);
     */
    getEncryptionType() {}
    /**
     * Returns the element's internal data type.
     * @returns The element's internal data type.
     * @example var grInc = new GlideRecord('incident');
     * grInc.query('priority', '1');
     * var field = grInc.getElement('priority');
     * var ed = field.getED();
     * var isEdge = ed.getInternalType();
     * gs.info(isEdge);
     */
    getInternalType() {}
    /**
     * Returns the element's label.
     * @returns The element's label.
     * @example var grInc = new GlideRecord('incident');
     * grInc.query('priority', '1');
     * var field = grInc.getElement('priority');
     * var ed = field.getED();
     * var isEdge = ed.getLabel();
     * gs.info(isEdge);
     */
    getLabel() {}
    /**
     * Returns the element's length.
     * @returns The element's size.
     * @example var grInc = new GlideRecord('incident');
     * grInc.query('priority', '1');
     * var field = grInc.getElement('priority');
     * var ed = field.getED();
     * var isEdge = ed.getLength();
     * gs.info(isEdge);
     */
    getLength() {}
    /**
     * Returns the element's name.
     * @returns The element's name.
     * @example var grInc = new GlideRecord('incident');
     * grInc.query('priority', '1');
     * var field = grInc.getElement('priority');
     * var ed = field.getED();
     * var isEdge = ed.getName();
     * gs.info(isEdge);
     */
    getName() {}
    /**
     * Returns the element's plural label.
     * @returns The element's plural label.
     * @example var gr = new GlideRecord('incident');
     * gr.query();
     * var ed = gr.getED();
     * gs.info(ed.getPlural());
     */
    getPlural() {}
    /**
     * Returns true if an encrypted attachment has been added to the table.
     * @returns Returns true if an encrypted attachment has been added to the table.
     * @example var grInc = new GlideRecord('incident');
     * grInc.query('priority', '1');
     * var field = grInc.getElement('priority');
     * var ed = field.getED();
     * var isEdge = ed.hasAttachmentsEncrypted();
     * gs.info(isEdge);
     */
    hasAttachmentsEncrypted() {}
    /**
     * Returns true if the element is an automatically generated or system field.
     * @returns True if the element is automatically generated or a system field.
     * @example var grInc = new GlideRecord('incident');
     * grInc.query('priority', '1');
     * var field = grInc.getElement('priority');
     * var ed = field.getED();
     * isEdge = ed.isAutoOrSysID();
     * gs.info(isEdge);
     * 
     */
    isAutoOrSysID() {}
    /**
     * Returns true if the element is defined as a dropdown choice in its dictionary
     * definition.
     * @returns Returns true if the element is defined as a dropdown choice. Returns true even
     * if there are no entries defined in the choice table. The last choice type,
     * suggestion, does not return true.
     * @example var grInc = new GlideRecord('incident');
     * grInc.query('priority', '1');
     * var field = grInc.getElement('priority');
     * var ed = field.getED();
     * var isChoiceTable = ed.isChoiceTable();
     * gs.info(isChoiceTable);
     */
    isChoiceTable() {}
    /**
     * Returns true if an element is encrypted.
     * @returns Returns true if the element is encrypted, false otherwise.
     * @example var grInc = new GlideRecord('incident');
     * grInc.query('priority', '1');
     * var field = grInc.getElement('priority');
     * var ed = field.getED();
     * var isEdge = ed.isEdgeEncrypted();
     * gs.info(isEdge)
     */
    isEdgeEncrypted() {}
    /**
     * Returns true if the element is a virtual element.
     * @returns Returns true if the element is a virtual element.
     * @example var grInc = new GlideRecord('incident');
     * grInc.query('priority', '1');
     * var field = grInc.getElement('priority');
     * var ed = field.getED();
     * var isVirtual = ed.isVirtual();
     * gs.info(isVirtual);
     */
    isVirtual() {}
}