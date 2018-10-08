//defer scrollable.js
var HOME_SCROLL_SPEED = 1;
var HOME_PAUSE_SPEED = 0;
var HOME_RESUME_SPEED = 1;
function scroller(divName) {
    var target = gel(divName);
    if (!target)
        return;
    var wrapper = gel(divName+"_wrap");
    var wrapperHeight = wrapper.offsetHeight;
    var containerHeight = target.offsetHeight;
    var actualheight = wrapperHeight
    if (wrapperHeight < containerHeight)
        actualheight = containerHeight;
    var currentScroll = parseInt(target.style.top) - HOME_SCROLL_SPEED;
    var bottom = actualheight + parseInt(target.style.top);
    if (bottom < 20)
        currentScroll = wrapperHeight;
    target.style.top=currentScroll + "px";
}