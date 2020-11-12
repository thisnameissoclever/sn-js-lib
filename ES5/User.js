/*
 * This replicates the outline of the User object for help in autocompletion.
 * http://wiki.service-now.com/index.php?title=Getting_a_User_Object
 * http://wiki.service-now.com/index.php?title=The_g_user_Object
 * http://www.servicenowguru.com/scripting/user-object-cheat-sheet/
 */
 function User() {

    //------------------------------------------------------------------------------//
    //--------------------------Descriptive Functions-------------------------------//
    //------------------------------------------------------------------------------//

    this.getFirstName = function () { };
    this.getLastName = function () { };
    this.getEmail = function () { };
    this.getDepartmentID = function () { };
    this.getCompanyID = function () { };
    this.getCompanyRecord = function () { };
    this.getLanguage = function () { };
    this.getLocation = function () { };
    this.getDomainID = function () { };
    this.getDomainDisplayValue = function () { };
    this.getManagerID = function () { };
    this.getUserByID = function () { };

    //------------------------------------------------------------------------------//
    //--------------------Security and Group Functions------------------------------//
    //------------------------------------------------------------------------------//
    this.getMyGroups = function () { };
    //this.isMemberOf = function(String) { }; //server-side only
    this.hasRole = function (String) { };
    this.hasRoles = function () { }; // Boolean Function

    this.getRecord = function () {return new GlideRecord();};
 };


 function GUser() {

    this.userName = '';
    this.firstName = '';
    this.lastName = '';
    this.userID = '';
    this.hasRole = function (String) { };
    this.hasRoles = function (String, String, String) { }; // Boolean Function
 };

 var g_user = new GUser();