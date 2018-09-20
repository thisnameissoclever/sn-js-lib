//include classes/ui/GlideAdministrationMenu.js
/**
*
* Important :: Registration of additional sub-containers must extend the 'GlideAdministrationSubContainer' in order
* for proper dimension properties to work.
*/
var GlideAdministrationMenu = Class.create({
    START_PROCESSING: 'start_processing',
    STOP_PROCESSING: 'stop_processing',
    EVENT_LAYOUT_UPDATE: 'EVENT_LAYOUT_UPDATE',
    STR_DEFAULT_SEARCH_TEXT: 'Search ...',
    initialize: function(isVisible) {
        this._isVisible = isVisible || false;
        this._isProcessing = false;
        this._preferences = {};
        this._container = $('am_container');
        CustomEvent.observe(this.START_PROCESSING, this.startProcessing.bind(this));
        CustomEvent.observe(this.STOP_PROCESSING, this.stopProcessing.bind(this));
        this._secJewelCase = $j('#am_sec_jewelcase');
        this._secNavChat = $j('#am_nav_chat');
        this._secNavPage = $j('#am_nav_page');
        /*this._fixedWidth = $j('#am_logo').outerWidth(true) + this._secJewelCase.outerWidth(true) +
$j('#am_search').outerWidth(true) + this._loading.outerWidth(true); */
        if (this._isVisible)
            this._initExtraContent();
    },
    _initExtraContent: function() {
        this.bindSearchEventHandlers();
        this.updateLayout();
        var self = this;
        $j('.am_notification_container').each(function() {
            $j(this).click(function(event) {
                self.toggleNotificationOver(event, $j(this));
                return false;
            });
        });
    },
    getLoadingIcon: function() {
        return this._container ? this._container.select('#am_loading_toggler')[0] : false;
    },
    startProcessing: function(options) {
        if (this._isProcessing)
            return;
        this._processingOpts = Object.extend({
            modal: true,
            uniqueKey: null
        }, options);
        if (this._isVisible)
            this.getLoadingIcon().show();
        if (this._processingOpts.modal === true) {
            var mask = $('processing_mask');
            if (!mask) {
                mask = document.createElement('div');
                mask.id = 'processing_mask';
                mask.className = 'glide_mask';
                document.body.appendChild(mask);
            }
            mask.style.display = 'block';
            this._processingMask = $(mask);
        } else
            this._processingMask = null;
        this._isProcessing = true;
    },
    stopProcessing: function(options) {
        if (!this._isProcessing)
            return;
        options = Object.extend({
            uniqueKey: null,
            forceStop: false
        }, options);
        if (!options.forceStop && this._processingOpts.uniqueKey && this._processingOpts.uniqueKey != options.uniqueKey)
            return;
        if (this._isVisible)
            this.getLoadingIcon().hide();
        if (this._processingMask)
            this._processingMask.hide();
        this._isProcessing = false;
    },
    isVisible: function() {
        return this._isVisible;
    },
    updateLayout: function() {
        var docWidth = $j(document).width();
        var chatWidth = this._secNavChat.outerWidth(true);
        var menuWidth = this._secNavPage.outerWidth(true);
        var w = chatWidth + menuWidth + this._fixedWidth;
        if (w < docWidth)
            this._container.css('min-width', (w+5) + 'px');
    },
    getHeight: function() {
        return this._isVisible ? this._container.getHeight() : 0;
    },
    bindSearchEventHandlers: function() {
        var jSearchBox = $j('#am_search_box').val(this.STR_DEFAULT_SEARCH_TEXT)
        .click(function() {
            jSearchBox.val('').addClass('am_search_box_active').parent().addClass('am_search_div_active');
            return false;
        })
        .blur(function() {
            jSearchBox.removeClass('am_search_box_active').val(self.STR_DEFAULT_SEARCH_TEXT);
            jSearchBox.parent().removeClass('am_search_div_active');
            return false;
        });
    },
    toggleNotificationOver: function(event, jElem) {
        event.stopPropagation();
        var self = this;
        $j('.am_notification_container.active', this._secJewelCase).each(function() {
            var elem = $j(this);
            self.toggleNotificationOut(elem, elem.next());
        });
        jElem.addClass('active');
        var jNext = jElem.next().show();
        $j(document).bind('click.adminmenu', function() {
            self.toggleNotificationOut(jElem, jNext);
        });
    },
    toggleNotificationOut: function(jElem, jNext) {
        jNext.hide();
        jElem.removeClass('active');
        $j(document).unbind('click.adminmenu');
    },
    toString: function() {
        return 'GlideAdministrationMenu';
    }
});
GlideAdministrationMenu.init = function(isVisible) {
    if (window.top == window.self && typeof g_adminMenu == 'undefined')
        window.g_adminMenu = new GlideAdministrationMenu(isVisible);
    return window.top.g_adminMenu;
};
GlideAdministrationMenu.get = function() {
    return window.top.g_adminMenu;
};