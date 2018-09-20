//defer classes/AttachmentUploader.js
/**
* AttachmentUploader class:  Support for uploading attachments.
*/
var AttachmentUploader = Class.create({
    initialize: function(event, file, fileNumber, showView, showPopup) {
        this.target = Event.element(event);
        this.file = file;
        this.fileNumber = fileNumber;
        this.showView = showView;
        this.showPopup = showPopup;
        this.control = gel("upload_file_" + this.fileNumber);
        this.progress = gel("upload_file_progress_" + this.fileNumber);
        this.CRLF  = "\r\n"
        var sys_id = gel("sys_uniqueValue");
        if (!sys_id)
            sys_id = gel("sysparm_item_guid"); // service catalog is different
        this.parent_sys_id = sys_id.value;
        var table = gel("sys_target");
        if (!table)
            table = gel("ni.attachment_target"); // service catalog is different
        this.table = table.value;
    },
    destroy: function() {
        this.target = null;
        this.xhr = null;
        this.file = null;
        this.control = null;
        this.progress = null;
    },
    send: function(uploadedFunction) {
        var xhr = new XMLHttpRequest();
        this.xhr = xhr;
        var self = this;
        Event.observe(this.xhr.upload, "load", function(e) {
            if (self.control) {
                try {
                    rel(self.control); // loading has finished, throw away the loading indicator
                } catch (e) {}
            }
        }, false);
        Event.observe(this.xhr.upload, "progress", function(e) {
            if (e.lengthComputable) {
                var percentage = Math.round((e.loaded * 100) / e.total);
                self._updateProgress(percentage + "%");
            }
        }, false);
        Event.observe(this.xhr.upload, "error", function(e) {
            self._updateProgress(" error");
            if (self.control)
                self.control.style.backgroundColor="tomato";
            self.destroy();
        }, false);
        Event.observe(this.xhr.upload, "loadstart", function(e) {
            self._updateProgress("started");
            if (self.control)
                self.control.style.backgroundColor="LightCyan";
        }, false);
        Event.observe(this.xhr.upload, "abort", function(e) {
            self._updateProgress(" aborted");
            if (self.control)
                self.control.style.backgroundColor="tomato";
            self.destroy();
        }, false);
        this.xhr.onreadystatechange = function() {
            if (self.xhr.readyState === 4) { // AJAX is complete, put the attachment name on the list and clean up
                var xml = self.xhr.responseXML;
                if (xml) {
                    var sys_id = xml.documentElement.getAttribute("sys_id");
                    addAttachmentNameToForm(sys_id, self.file.name, "New", "images/attachment.gifx", self.showView, self.showPopup);
                    if (typeof uploadedFunction == "function") {
                        self.sys_id = sys_id;
                        uploadedFunction.call(this, self);
                    }
                }
                self.destroy();
            }
        }
        var boundary = "AJAX--------------" + (new Date).getTime();
        var parts = [];
        var sys_id = this._getFieldEncoding("sysparm_sys_id", this.parent_sys_id);
        parts.push(sys_id);
        var table = this._getFieldEncoding("sysparm_table", this.table);
        parts.push(table);
        var nostack = this._getFieldEncoding("sysparm_nostack", "yes");
        parts.push(nostack);
        var sendXml = this._getFieldEncoding("sysparm_send_xml", "true");
        parts.push(sendXml);
        if (typeof g_ck != 'undefined' && g_ck != "") {
            var security_ck = this._getFieldEncoding("sysparm_ck", g_ck);
            parts.push(security_ck);
        }
        var getBinaryDataReader = new FileReader();
        if (typeof getBinaryDataReader.addEventListener == "undefined") {
            this._updateProgress("browser has not implemented FileReader.addEventListener");
            return;
        }
        getBinaryDataReader.addEventListener("loadend", function(e) {
            var filePart = "";
            filePart += 'Content-Disposition: form-data; ';
            filePart += 'name="file"; ';
            filePart += 'filename="'+ self.file.name + '"' + self.CRLF;
            var fileType = self.file.type;
            if (fileType == "")
                fileType = "application/octet-stream";
            filePart += "Content-Type: " + fileType;
            filePart += self.CRLF + self.CRLF; // marks end of the headers part
            filePart += e.target.result + self.CRLF;
            parts.push(filePart);
            fliePart = null;
            var request = "--" + boundary + self.CRLF;
            request+= parts.join("--" + boundary + self.CRLF);
            request+= "--" + boundary + "--" + self.CRLF;
            self.xhr.open("POST", "sys_attachment.do");
            var contentType = "multipart/form-data; boundary=" + boundary;
            self.xhr.setRequestHeader("Content-Type", contentType);
            self.xhr.sendAsBinary(request);
        }, false);
        getBinaryDataReader.readAsBinaryString(this.file);  // start asynchronous file read
    },
    _updateProgress: function(txt) {
        if (this.progress)
            this.progress.innerHTML = txt;
    },
    _getFieldEncoding: function(name, value) {
        var part = 'Content-Disposition: form-data; ';
        part += 'name="' + name + '"' + this.CRLF + this.CRLF;
        part += value + this.CRLF;
        return part;
    },
    type: function() {
        return "AttachmentUploader";
    }
});
AttachmentUploader.addDropZone = function(dropZone, maxMegabytes, canAttach, showView, showPopup, extensions, uploadedFunction) {
    if (typeof FileReader == "undefined")
        return; // if your browser does not implement FileReader, you cannot do this
    if (canAttach == "false") {
        AttachmentUploader.noDropZone("File attachments not allowed");
        return;
    }
    if (maxMegabytes != "")
        maxMegabytes = parseInt(maxMegabytes, 10);
    else
        maxMegabytes = 0;
    if (isNaN(maxMegabytes))
        maxMegabytes = 0;
    var gotExtensions = false;
    if (extensions) {
        extensions = extensions.split(",");
        gotExtensions = true;
    }
    Event.observe(dropZone, "dragover", function(event) {
        Event.stop(event);
        var headerAttachment = gel("header_attachment");
        if (headerAttachment && headerAttachment.style.backgroundColor != "orange") {
            headerAttachment.style.backgroundColor = "orange";
            needsReset = true;
        }
        var line = gel("header_attachment_line");
        if (line) {
            if (line.style.visibility == "hidden") {
                line.reverseOnCancel = "true";
                showObjectInline(gel("header_attachment_list_label"));
                line.style.visibility = "visible";
                line.style.display = "";
            }
            line.resetDisplay = "1";
        }
        setTimeout("AttachmentUploader._resetBackground(false)", 1000); // make sure effect goes away eventually
        event.dataTransfer.effectAllowed = "copy";
        event.dataTransfer.dropEffect="copy";
        return false;
    }, true);
    Event.observe(dropZone, "dragend", function(event) {
        Event.stop(event);
        AttachmentUploader._resetBackground(true);
    }, true);
    Event.observe(dropZone, "drop", function(event) {
        AttachmentUploader._resetBackground(true);
        var files = event.dataTransfer.files
        if (files.length < 1) // if no files we dropped, this was not a file drop so don't stop
            return;
        Event.stop(event);
        if (dropZone.disableAttachments == "true") { // in some cases, a script may ask that no attachments be allowed
            alert("Attachments are not allowed");
            return;
        }
        var line = gel("header_attachment_line");
        if (line)
            line.reverseOnCancel = "false";
        var attachments = gel("header_attachment_list");
        var containingSpan;
        var progressSpan = gel("attachment_upload_progress");
        progressSpan.innerHTML = "";
        for (var i = 0; i < files.length; i++) {
            var p = cel("p");
            p.id = "upload_file_" + i;
            p.innerHTML = files[i].name + " (" + AttachmentUploader.getDisplaySize(files[i].size) + ") ";
            var span = cel("span");
            span.id = "upload_file_progress_" + i;
            p.appendChild(span);
            progressSpan.appendChild(p);
        }
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var megs = file.size / 1048576;
            if (maxMegabytes > 0) {
                if (megs > maxMegabytes) {
                    var progress = gel("upload_file_progress_" + i);
                    progress.innerHTML = "<font color='red'>file larger than maximum of " + maxMegabytes + "MB</font>";
                    files[i] = null;
                    continue;
                }
            }
            if (gotExtensions) {
                var badExtension = false;
                var periodIndex = file.name.lastIndexOf(".");
                var extension = "(none)";
                if (periodIndex == -1)
                    badExtension = true;
                else {
                    extension = file.name.substring(periodIndex+1);
                    if (extensions.indexOf(extension) == -1)
                        badExtension = true;
                }
                if (badExtension) {
                    var progress = gel("upload_file_progress_" + i);
                    progress.innerHTML = "<font color='red'>Files of extension ." + extension + " are not allowed</font>";
                    continue;
                }
            }
            var uploader = new AttachmentUploader(event, file, i, showView, showPopup);
            uploader.send(uploadedFunction);
        }
    }, true);
};
AttachmentUploader._resetBackground = function(doNow) {
    var line = gel("header_attachment_line");
    if (!line)
        return;
    if (doNow != true && typeof line.resetDisplay != "undefined") {
        var resetDisplay = parseInt(line.resetDisplay);
        resetDisplay++;
        line.resetDisplay = resetDisplay;
        if (resetDisplay < 10)
            return;
    }
    var headerAttachment = gel("header_attachment");
    if (headerAttachment)
        headerAttachment.style.backgroundColor = "";
    if (line.reverseOnCancel == "true") {
        line.reverseOnCanel = "false";
        hideObject(gel("header_attachment_list_label"));
        line.style.visibility = "hidden";
        line.style.display = "none";
    }
}
AttachmentUploader.getDisplaySize = function(sizeInBytes) {
    var kilobytes = Math.round(sizeInBytes / 1024);
    if (kilobytes < 1)
        kilobytes = 1;
    var reportSize = kilobytes + "K";
    if (kilobytes > 1024)
        reportSize = Math.round(kilobytes / 1024) + "MB";
    return reportSize;
}
AttachmentUploader.noDropZone = function(message) {
    var dropZone = document.body;
    Event.observe(dropZone, "dragover", function(event) {
        Event.stop(event);
        if (isChrome)
            event.dataTransfer.dropEffect="copy";
        return true;
    }, true);
    Event.observe(dropZone, "dragleave", function(event) {
        Event.stop(event);
    }, true);
    Event.observe(dropZone, "drop", function(event) {
        Event.stop(event);
        alert(message);
    }, true);
}
AttachmentUploader.disableAttachments = function() {
    document.body.disableAttachments = "true";
}