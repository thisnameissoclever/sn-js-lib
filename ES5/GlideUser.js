//include classes/GlideUser.js
var GlideUser = Class.create({
    initialize: function(userName, firstName, lastName, commaRoles, userID) {
        this.userName = userName;
        this.firstName = firstName;
        this.lastName = lastName;
        this.setFullName(this.firstName + " " + this.lastName);
        this.setRoles(commaRoles);
        this.userID = userID;
        this.preferences = new Object();
        this.clientData = new Object();
    },
    hasRoleExactly: function(role) {
        if (!role || typeof role != 'string')
            return false;
        for (var x = 0, l = this.roles.length; x < l; x++) {
            if (this.roles[x].toLowerCase() == role.toLowerCase())
                return true;
        }
        return false;
    },
    hasRoles: function() {
        return this.roles.length > 0;
    },
    hasRole: function(role) {
        if (this.hasRoleExactly('maint'))
            return true;
        if (this.hasRoleExactly(role))
            return true;
        if (role == 'maint')
            return false;
        if (this.hasRoleExactly('admin'))
            return true;
        return false;
    },
    hasRoleFromList: function(roles) {
        var rolesToMatch = new Array();
        if (roles)
            rolesToMatch = roles.split(/\s*,\s*/);
        if (rolesToMatch.length == 0)
            return true;
        for(var i = 0; i < rolesToMatch.length; i++) {
            var r = rolesToMatch[i];
            if (r && this.hasRole(r))
                return true;
        }
        return false;
    },
    getFullName: function() {
        return this.fullName;
    },
    setFullName: function(fn) {
        this.fullName = fn;
    },
    getRoles: function() {
        return this.roles;
    },
    getAvailableElevatedRoles: function() {
        return this.elevatedRoles;
    },
    setRoles: function(r) {
        if (r)
            this.roles = r.split(/\s*,\s*/);
        else
            this.roles = new Array();
    },
    setElevatedRoles: function(r) {
        if (r)
            this.elevatedRoles = r.split(/\s*,\s*/);
        else
            this.elevatedRoles = new Array();
    },
    setDomain: function(d) {
        this.domain = d;
    },
    getPreference: function(n) {
        return this.preferences[n];
    },
    setPreference: function(n, v) {
        this.preferences[n] = v;
    },
    deletePreference: function(n) {
        delete this.preferences[n];
    },
    getClientData: function(n) {
        return this.clientData[n];
    },
    setClientData: function(n, v) {
        this.clientData[n] = v;
    },
    setBannerImage: function(s) {
        this.bannerImage = s;
    },
    getBannerImage: function() {
        return this.bannerImage;
    },
    setBannerText: function(s) {
        this.bannerText = s;
    },
    getUserByID: function(idOrUserName) {
        return 'something';
    },
    getBannerText: function() {
        return this.bannerText;
    },
    setHomePages: function(s) {
        this.homePages = s;
    },
    getHomePages: function() {
        return this.homePages;
    },
    type: "GlideUser"
});