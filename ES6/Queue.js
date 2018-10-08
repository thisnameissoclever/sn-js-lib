/**
 * The Queue API allows you to retrieve or join a Connect Support chat queue.
 * @class Queue
 * @typedef {Object}  Queue
 */
class Queue {
    constructor() {}
    /**
     * Get an existing chat queue by sys_ID.
     * @param {String} SysID The sysID of a queue from the chat_queue table.
     * @returns Returns a conversation queue object.
     * @example var queue = sn_connect.Queue.get("ab73be7dc09a4300964f336ee6b74361");
     */
    get(SysID) {}
    /**
     * Adds the current user to an existing Connect Support chat queue. Use a sysID
     * from the chat_queue table.
     * @param {String} Question Type a question to add to the queue.
     * @returns Method does not return a value
     * @example var queue = sn_connect.Queue.get("ab73be7dc09a4300964f336ee6b74361");
     * queue.join("How do I access my email?");
     */
    join(Question) {}
}