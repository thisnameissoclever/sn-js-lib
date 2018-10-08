/**
 * A RESTAPIResponseStream object allows you to write directly to the scripted REST API
 * response stream.
 * @class RESTAPIResponseStream
 * @typedef {Object}  RESTAPIResponseStream
 */
class RESTAPIResponseStream {
    constructor() {}
    /**
     * Write an input stream to the response stream.
     * @param {Object} stream An attachment or a response stream from a third-party service.
     * @returns Method does not return a value
     * @example response.setContentType('application/json');
     * response.setStatus(200);
     * var writer = response.getStreamWriter();
     * var attachmentStream = new GlideSysAttachmentInputStream(&lt;sys id of attachment&gt;);
     * writer.writeStream(attachmentStream);
     */
    writeStream(stream) {}
    /**
     * Write string data to the response stream.
     * @param {String} data The string to add to the response data.
     * @returns Method does not return a value
     * @example response.setContentType('application/json');
     * response.setStatus(200);
     * var writer = response.getStreamWriter();
     * var body ={
     * name:user1,
     * id: 1234,
     * roles: [
     * {
     * name: admin
     * },
     * {
     * name: itil
     * }
     * ]
     * }
     * writer.writeString("{'name':'user','id':'1234'}");
     * writer.writeString(JSON.stringify(body));
     */
    writeString(data) {}
}