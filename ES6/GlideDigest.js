/**
 * The scoped GlideDigest class provides methods for creating a message digest from strings
 * or input streams using MD5, SHA1, or SHA256 hash algorithms.
 * @class GlideDigest
 * @typedef {Object}  GlideDigest
 */
class GlideDigest {
    /**
     * Creates an instance of scoped GlideDigest.
     */
    constructor() {}
    /**
     * Create a message digest from a string using the MD5 algorithm. The output string is in
     * Base64.
     * @param {String} source The source string.
     * @returns The message digest.
     * @example var inputString = "Her molasses flowed slowly down the hill.";
     * var digest = new GlideDigest();
     * gs.info(digest.getMD5Base64(inputString));
     */
    getMD5Base64(source) {}
    /**
     * Create a message digest from an input stream using the MD5 algorithm. The output string
     * is in Base64.
     * @param {GlideScriptableInputStream} inputStream The source input stream.
     * @returns The message digest.
     * @example var inputStream = new GlideSysAttachment().getContentStream(attachmentSysID);
     * var digest = new GlideDigest();
     * gs.info(digest.getMD5Base64FromInputStream(inputStream));
     */
    getMD5Base64FromInputStream(inputStream) {}
    /**
     * Create a message digest from a string using the MD5 algorithm. The output string is in
     * hexadecimal.
     * @param {String} source The source string.
     * @returns The message digest.
     * @example var inputString = "Her molasses flowed slowly down the hill.";
     * var digest = new GlideDigest();
     * gs.info(digest.getMD5Hex(inputString));
     */
    getMD5Hex(source) {}
    /**
     * Create a message digest from an input stream using the MD5 algorithm. The output string
     * is in hexadecimal.
     * @param {GlideScriptableInputStream} inputStream The source input stream.
     * @returns The message digest.
     * @example var inputStream = new GlideSysAttachment().getContentStream(attachmentSysID);
     * var digest = new GlideDigest();
     * gs.info(digest.getMD5HexFromInputStream(inputStream));
     */
    getMD5HexFromInputStream(inputStream) {}
    /**
     * Create a message digest from a string using the SHA1 algorithm. The output string is in
     * Base64.
     * @param {String} source The source string.
     * @returns The message digest.
     * @example var inputString = "Her molasses flowed slowly down the hill.";
     * var digest = new GlideDigest();
     * gs.info(digest.getSHA1Base64(inputString));
     */
    getSHA1Base64(source) {}
    /**
     * Create a message digest from an input stream using the SHA1 algorithm. The output
     * string is in Base64.
     * @param {GlideScriptableInputStream} inputStream The source input stream.
     * @returns The message digest.
     * @example var inputStream = new GlideSysAttachment().getContentStream(attachmentSysID);
     * var digest = new GlideDigest();
     * gs.info(digest.getSHA1Base64FromInputStream(inputStream));
     */
    getSHA1Base64FromInputStream(inputStream) {}
    /**
     * Create a message digest from a string using the SHA1 algorithm. The output string is in
     * hexadecimal.
     * @param {String} source The source string.
     * @returns The message digest.
     * @example var inputString = "Her molasses flowed slowly down the hill.";
     * var digest = new GlideDigest();
     * gs.info(digest.getSHA1Hex(inputString));
     */
    getSHA1Hex(source) {}
    /**
     * Create a message digest from an input stream using the SHA1 algorithm. The output
     * string is in hexadecimal.
     * @param {GlideScriptableInputStream} inputStream The source input stream.
     * @returns The message digest.
     * @example var inputStream = new GlideSysAttachment().getContentStream(attachmentSysID);
     * var digest = new GlideDigest();
     * gs.info(digest.getSHA1HexFromInputStream(inputStream));
     */
    getSHA1HexFromInputStream(inputStream) {}
    /**
     * Create a message digest from a string using the SHA256 algorithm. The output string is
     * in Base64.
     * @param {String} source The source string.
     * @returns The message digest.
     * @example var inputString = "Her molasses flowed slowly down the hill.";
     * var digest = new GlideDigest();
     * gs.info(digest.getSHA256Base64(inputString));
     */
    getSHA256Base64(source) {}
    /**
     * Create a message digest from an input stream using the SHA256 algorithm. The output
     * string is in Base64.
     * @param {GlideScriptableInputStream} inputStream The source input stream.
     * @returns The message digest.
     * @example var inputStream = new GlideSysAttachment().getContentStream(attachmentSysID);
     * var digest = new GlideDigest();
     * gs.info(digest.getSHA256Base64FromInputStream(inputStream));
     */
    getSHA256Base64FromInputStream(inputStream) {}
    /**
     * Create a message digest from a string using the SHA256 algorithm. The output string is
     * in hexadecimal.
     * @param {String} source The source string.
     * @returns The message digest.
     * @example var inputString = "Her molasses flowed slowly down the hill.";
     * var digest = new GlideDigest();
     * gs.info(digest.getSHA256Hex(inputString));
     */
    getSHA256Hex(source) {}
    /**
     * Create a message digest from an input stream using the SHA256 algorithm. The output
     * string is in hexadecimal.
     * @param {GlideScriptableInputStream} inputStream The source input stream.
     * @returns The message digest.
     * @example var inputStream = new GlideSysAttachment().getContentStream(attachmentSysID);
     * var digest = new GlideDigest();
     * gs.info(digest.getSHA256HexFromInputStream(inputStream));
     */
    getSHA256HexFromInputStream(inputStream) {}
}