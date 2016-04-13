"use strict";
function loadBinaryData(url,callback){
    var _ = new XMLHttpRequest();
    _.open("GET", url, true);
    _.responseType = "arraybuffer";
    _.onload = function () {
        if (_.response) callback(_.response);
        else callback(null);
    };
    _.send(null);
}