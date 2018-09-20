//defer rico_effect.js
/**
*
*  Copyright 2005 Sabre Airline Solutions
*
*  Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
*  file except in compliance with the License. You may obtain a copy of the License at
*
*         http://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software distributed under the
*  License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
*  either express or implied. See the License for the specific language governing permissions
*  and limitations under the License.
**/
var Rico = {}
Rico.Effect = {};
Rico.Effect.Size = Class.create();
Rico.Effect.Size.prototype = {
    initialize: function(element, w, h, duration, steps, options) {
        new Rico.Effect.SizeAndPosition(element, null, null, w, h, duration, steps, options);
    }
}
Rico.Effect.SizeAndPosition = Class.create();
Rico.Effect.SizeAndPosition.prototype = {
    initialize: function(element, x, y, w, h, duration, steps, options) {
        this.element = $(element);
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.duration = duration;
        this.steps    = steps;
        this.options  = arguments[7] || {};
        this.sizeAndPosition();
    },
    sizeAndPosition: function() {
        if (this.isFinished()) {
            if(this.options.complete) this.options.complete(this);
            return;
        }
        if (this.timer)
            clearTimeout(this.timer);
        var stepDuration = Math.round(this.duration/this.steps) ;
        var currentX = this.element.offsetLeft;
        var currentY = this.element.offsetTop;
        var currentW = this.element.offsetWidth;
        var currentH = this.element.offsetHeight;
        this.x = (this.x) ? this.x : currentX;
        this.y = (this.y) ? this.y : currentY;
        this.w = (this.w) ? this.w : currentW;
        this.h = (this.h) ? this.h : currentH;
        var difX = this.steps >  0 ? (this.x - currentX)/this.steps : 0;
        var difY = this.steps >  0 ? (this.y - currentY)/this.steps : 0;
        var difW = this.steps >  0 ? (this.w - currentW)/this.steps : 0;
        var difH = this.steps >  0 ? (this.h - currentH)/this.steps : 0;
        this.moveBy(difX, difY);
        this.resizeBy(difW, difH);
        this.duration -= stepDuration;
        this.steps--;
        if (this.options.step) this.options.step(this);
        this.timer = setTimeout(this.sizeAndPosition.bind(this), stepDuration);
    },
    isFinished: function() {
        return this.steps <= 0;
    },
    moveBy: function( difX, difY ) {
        var currentLeft = this.element.offsetLeft;
        var currentTop  = this.element.offsetTop;
        var intDifX     = parseInt(difX);
        var intDifY     = parseInt(difY);
        var style = this.element.style;
        if ( intDifX != 0 )
            style.left = (currentLeft + intDifX) + "px";
        if ( intDifY != 0 )
            style.top  = (currentTop + intDifY) + "px";
    },
    resizeBy: function( difW, difH ) {
        var currentWidth  = this.element.offsetWidth;
        var currentHeight = this.element.offsetHeight;
        var intDifW       = parseInt(difW);
        var intDifH       = parseInt(difH);
        var style = this.element.style;
        if ( intDifW != 0 )
            style.width   = (currentWidth  + intDifW) + "px";
        if ( intDifH != 0 )
            style.height  = (currentHeight + intDifH) + "px";
    }
}