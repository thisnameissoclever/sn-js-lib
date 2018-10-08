//defer email_activity.js
function setEmailBody(id) {
    var iframeID = id + ".body";
    var iframe = gel(iframeID);
    if (iframe)
        return;
    iframe = cel("iframe");
    iframe.id = iframeID;
    iframe.width="100%";
    iframe.frameBorder = "0";
    Event.observe(iframe, "load", emailResizeObserved.bind(iframe), true);
    iframe.src = "email_display.do?email_id=" + id;
    iframe.email_id = id;
    var cellID = id + ".mail_cell";
    var td = gel(cellID);
    if (!td) {
        alert("email_activity.js: TD missing for '" + cellID + "'");
        return;
    }
    td.appendChild(iframe);
}
function emailResizeObserved() {
    adjustEmailHeight(this);
}
function adjustEmailHeight(frame) {
    frame.style.height = frame.contentWindow.document.body.scrollHeight + 'px';
    if (isSafari || isChrome) {
        var table = gel(frame.email_id + ".detail");
        if (table)
            table.style.width="100%";
    }
}