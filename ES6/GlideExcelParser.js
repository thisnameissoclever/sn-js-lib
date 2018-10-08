/**
 * You can parse .xlsx formatted Excel files.
 * @class GlideExcelParser
 * @typedef {Object}  GlideExcelParser
 */
class GlideExcelParser {
    /**
     * Creates an instance of GlideExcelParser.
     */
    constructor() {}
    /**
     * Close the connection to the input stream and release the document.
     * @returns Method does not return a value
     */
    close() {}
    /**
     * Returns a list of column headers from the parsed document.
     * @returns An array of strings of column headers from the parsed document.
     */
    getColumnHeaders() {}
    /**
     * Returns the error message when the parse() method fails.
     * @returns The error message.
     */
    getErrorMessage() {}
    /**
     * Get the current row values and headers.
     * @returns The row headers are property names and the row values are property
     * values.
     */
    getRow() {}
    /**
     * Moves to the next row.
     * @returns Returns true if there is a next row, otherwise, returns false.
     */
    next() {}
    /**
     * Parse an XLSX formatted Excel document.
     * @param {GlideScriptableInputStream} inputStream The Excel document to be parsed.
     * @returns Returns true if the parse was successful, otherwise, returns false.
     * @example var parser = new sn_impex.GlideExcelParser();
     * parser.parse(request.body.dataStream); 
     */
    parse(inputStream) {}
    /**
     * Set the number of the header row to be retrieved.
     * @param {Number} headerRowNumber The header row to be retrieved.
     * @returns Method does not return a value
     */
    setHeaderRowNumber(headerRowNumber) {}
    /**
     * Return an empty value instead of null when an Excel cell is not present.
     * @param {Boolean} empty When true, cells that are not present return an empty value. When false, cells
     * that are not present return null.
     * @returns Method does not return a value
     */
    setNullToEmpty(empty) {}
    /**
     * Set the name of the sheet to be retrieved.
     * @param {String} sheetName The name of the sheet to be retrieved.
     * @returns Method does not return a value
     */
    setSheetName(sheetName) {}
    /**
     * Set the number of the Excel sheet to be retrieved.
     * @param {Number} sheetNumber The Excel sheet number to retrieve.
     * @returns Method does not return a value
     */
    setSheetNumber(sheetNumber) {}
}