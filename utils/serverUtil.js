function getParams(url) {
    if (url.indexOf("?") != -1) {
        url = url.split("?")[1];
    }
    var params = {};
    for (var i = 0; i < url.split("&").length; i++) {
        var param = url.split("&")[i];
        if (param.indexOf("=") != -1) {
            params[param.split("=")[0]] = param.split("=")[1];
        }
    }
    return params;
}

module.exports = getParams;