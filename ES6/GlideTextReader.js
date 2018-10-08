/**
 * Provides the ability to read single lines from an input stream. Because an input stream
 * is used, it is not subject to the 5MB attachment size limit.
 * @class GlideTextReader
 * @typedef {Object}  GlideTextReader
 */
class GlideTextReader {
    /**
     * Creates a scoped GlideTextReader object for the specified input stream.
     * @param {GlideScriptableInputStream} inputStream The input stream to be read.
     */
    constructor(inputStream) {}
    /**
     * Returns the character encoding of the input stream.
     * @returns The character encoding of the input stream.
     */
    getEncoding() {}
    /**
     * Returns a single line from the input stream and returns a string. Since this is working
     * off of a stream, it is not subject to the 5MB size limit.
     * @returns A single line of input up to the carriage return. Does not include the carriage
     * return. Returns null if there is no content.
     * @example var is = new GlideSysAttachment().getContentStream(attachmentSysId);
     * var reader = new GlideTextReader(is);
     * var ln = ' ';
     * while((ln = reader.readLine()) != null) {
     * gs.info(ln);
     * }
     */
    readLine() {}
}