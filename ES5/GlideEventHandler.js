//include classes/GlideEventHandler.js
var GlideEventHandler = Class.create({
    initialize: function (handlerName, handler, fieldName) {
        this.handlerName = handlerName;
        this.handler = handler;
        this.fieldName = fieldName;
    }
});