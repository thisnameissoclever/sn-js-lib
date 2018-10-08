//include classes/StackManagement.js
/**
* Keep track of the stack per tab/window
*
* - Stack name is stored in window.name of the top window
*/
var StackManagement = Class.create({
    initialize: function() {
    },
    setStackName: function() {
        var w = getTopWindow();
        if (!w.name || !w.name.startsWith("snc:"))
            w.name = "snc:" + guid();
    },
    getStackName: function() {
        var w = getTopWindow();
        return w.name;
    },
    type: 'StackManagement'
});