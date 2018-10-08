/**
 * The GlideSysAttachment API provides a way to handle attachments.
 * @class GlideSysAttachment
 * @typedef {Object}  GlideSysAttachment
 */
class GlideSysAttachment {
    /**
     * Creates an instance of the GlideSysAttachment class.
     */
    constructor() {}
    /**
     * Copies attachments from the source record to the target record.
     * @param {String} sourceTable Name of the table with the attachments to be copied.
     * @param {String} sourceID The source table's sysID.
     * @param {String} targetTable Name of the table to have the attachments added.
     * @param {String} targetID The target table's sysID.
     * @returns Array of sysIDs of the attachments that were copied.
     */
    copy(sourceTable, sourceID, targetTable, targetID) {}
    /**
     * Deletes the specified attachment.
     * @param {String} attachmentID The attachment's sysID.
     * @returns Method does not return a value
     */
    deleteAttachment(attachmentID) {}
    /**
     * Returns the attachment content as a string.
     * @param {GlideRecord} sysAttachment The attachment record.
     * @returns The attachment contents as a string. Returns up to 5 MB of data.
     */
    getContent(sysAttachment) {}
    /**
     * Returns the attachment content as a string with base64 encoding.
     * @param {GlideRecord} sysAttachment The attachment record.
     * @returns The attachment contents as a string with base64 encoding. Returns up to 5 MB of
     * data.
     */
    getContentBase64(sysAttachment) {}
    /**
     * Returns a GlideScriptableInputStream object given the sysID of an
     * attachment.
     * @param {String} sysID The attachment sysID.
     * @returns A stream that contains the attachment content.
     */
    getContentStream(sysID) {}
    /**
     * Inserts an attachment for the specified record.
     * @param {GlideRecord} record The record to which the attachment is to be attached.
     * @param {String} fileName The attachment's file name.
     * @param {String} contentType The attachment's content type.
     * @param {String} content The attachment content.
     * @returns The attachment's sysID. Returns null if the attachment was not added.
     */
    write(record, fileName, contentType, content) {}
    /**
     * Inserts an attachment for the specified record using base64 encoded
     * content.
     * @param {GlideRecord} gr The record to which the attachment is to be attached.
     * @param {String} fileName The attachment's file name.
     * @param {String} contentType The attachment's content type.
     * @param {String} content The attachment content in base64 format.
     * @returns The sysID of the attachment created.
     */
    writeBase64(gr, fileName, contentType, content) {}
    /**
     * Inserts an attachment using the input stream.
     * @param {GlideRecord} gr The record to which the attachment is to be attached.
     * @param {String} fileName The attachment's file name.
     * @param {String} contentType The attachment's content type.
     * @param {GlideScriptableInputStream} content The attachment content.
     * @returns The sysID of the attachment created.
     */
    writeContentStream(gr, fileName, contentType, content) {}
}