function getUserName(url) {
    if (url.indexOf("?") != -1) {
        url = url.split("?")[1];
    }
    for (var i = 0; i < url.split("&").length; i++) {
        var param = url.split("&")[i];
        if (param.indexOf("=") != -1 && param.split("=")[0] == "userId") {
            return param.split("=")[1];
        }
    }
}

module.exports = getUserName;