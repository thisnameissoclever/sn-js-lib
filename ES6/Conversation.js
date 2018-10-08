/**
 * Conversation API enables you to create or modify Connect conversations.
 * @class Conversation
 * @typedef {Object}  Conversation
 */
class Conversation {
    constructor() {}
    /**
     * Adds
     * a user to a conversation.
     * @param {String} sysID The sys_ID of the user you want to add to a conversation.
     * @returns Method does not return a value
     * @example var conversation = sn_connect.Conversation.get("7caf49111309030034bb58a12244b06c");
     * conversation.addSubscriber("a8f98bb0eb32010045e1a5115206fe3a");
     */
    addSubscriber(sysID) {}
    /**
     * Creates a Connect
     * conversation.
     * @param {String} name Create a conversation with a specific name.
     * @param {String} type Include a specific conversation type. The type is determined by the type choice
     * list. The base system includes the following type options:
     * connect
     * support
     * group
     * peer
     * qanda
     * team
     * 
     * @returns Scriptable Conversation
     * @example var conversation = sn_connect.Conversation.create({
     * name: "Hello world",
     * type: "connect"
     * });
     */
    create(name, type) {}
    /**
     * Returns an existing Connect conversation by sys_id.
     * @param {String} sysID The sys_id of the conversation record.
     * @returns Conversation object
     * @example var conversation = sn_connect.Conversation.get("27b9844c1385030034bb58a12244b037");
     */
    get(sysID) {}
    /**
     * Removes
     * a user from a conversation.
     * @param {String} SysID The sys_id of the user you want to remove from a conversation.
     * @returns Method does not return a value
     * @example var conversation = sn_connect.Conversation.get("7caf49111309030034bb58a12244b06c");
     * conversation.removeSubscriber("a8f98bb0eb32010045e1a5115206fe3a");
     */
    removeSubscriber(SysID) {}
    /**
     * Sends a message to a conversation.
     * @param {String} Body The main text of the message.
     * @param {String} Field The field you want the message to appear as. Only use this option if adding a
     * message to a record conversation. Choose from work_notes, comments, or system. Using
     * system as the field treats the message as a system message.
     * @returns Method does not return a value
     * @example var conversation = sn_connect.Conversation.get("2064fa3919010300964f5270e9840fbb");
     * conversation.sendMessage(body: "Hello world", field: "work_notes");
     */
    sendMessage(Body, Field) {}
}