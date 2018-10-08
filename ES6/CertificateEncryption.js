/**
 * APIs available for encrypting certificates in scoped applications.
 * @class CertificateEncryption
 * @typedef {Object}  CertificateEncryption
 */
class CertificateEncryption {
    /**
     * Instantiates a CertificateEncryption object in a scoped application.
     */
    constructor() {}
    /**
     * Generates the Message Authentication Code (MAC), which is used to authenticate a
     * message.
     * @param {String} key Key used to sign the message.
     * @param {String} algorithm Algorithm used to generate the MAC: HmacSHA256, HmacSHA1, HmacMD5, and so
     * on.
     * @param {String} data Data to be processed.
     * @returns MAC in base64 format.
     * @example var mac = new CertificateEncryption;
     * mac.generateMac("sample_key", "HmacSHA256", "sample_data");
     */
    generateMac(key, algorithm, data) {}
    /**
     * Generates a hash (SHA-1, SHA-256, and so on) for the certificate from Trust Store
     * Cert.
     * @param {String} certificateID sys_id of the certificate record in the X.509 Certificate [sys_certificate]
     * table.
     * @param {String} algorithm SHA-1, SHA-256, and so on
     * @returns Thumbprint in base64 format.
     */
    getThumbPrint(certificateID, algorithm) {}
    /**
     * Generates a hash (SHA-1, SHA-256, and so on) for the certificate from the keystore
     * entry.
     * @param {String} certificateID sys_id of the certificate record in the X.509 Certificate [sys_certificate]
     * table.
     * @param {String} alias Alias name for the certificate.
     * @param {String} algorithm SHA-1, SHA-256, and so on.
     * @returns Thumbprint in base64 format.
     */
    getThumbPrintFromKeystore(certificateID, alias, algorithm) {}
    /**
     * Signs the data using the private key and the given algorithm.
     * @param {String} certificateID sys_id of the certificate record in the X.509 Certificate [sys_certificate]
     * table.
     * @param {String} alias Private key name.
     * @param {String} aliaspassword Password for the private key.
     * @param {String} datatosign Data to sign.
     * @param {String} algorithm SHA-1, SHA-256, and so on.
     * @returns Signed data in base64 format.
     * @example var ce = new CertificateEncryption;
     * ce.sign("recordID", "alias", "password", "SHA-1", "sign this data");
     */
    sign(certificateID, alias, aliaspassword, datatosign, algorithm) {}
}