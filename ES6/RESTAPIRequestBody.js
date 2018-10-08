/**
 * A RESTAPIRequestBody object allows you to access the body content of a scripted REST
 * API request in scripts.
 * @class RESTAPIRequestBody
 * @typedef {Object}  RESTAPIRequestBody
 */
class RESTAPIRequestBody {
    constructor() {}
    /**
     * Determine if there are additional entries in the request body.
     * @returns True if there are additional entries available. This method returns true only
     * once if the request contains a single entry.
     * @example var requestBody = request.body;
     * requestBody.hasNext(); // returns true if the request contains a single entry or multiple entries
     * //calling second time
     * requestBody.hasNext(); // returns false if the request contains a single entry, or true if the request contains multiple entries
     */
    hasNext() {}
    /**
     * Retrieve one entry from the request body as a script object.
     * @returns A single entry from the request body.
     * @example var requestBody = request.body;
     * var requestEntry = requestBody.nextEntry(); // returns available entry if there is only one entry, or the first entry if there are multiple.
     * var name = requestEntry.name; // ‘user1’
     * // Calling second time
     * requestEntry = requestBody.nextEntry(); // returns undefined if there is only one entry, or the second entry if there are multiple.
     * @example var requestBody = request.body;
     * while(requestBody.hasNext()){
     * var entry = requestBody.nextEntry();
     * }
     */
    nextEntry() {}
}