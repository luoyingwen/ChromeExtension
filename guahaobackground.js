/*global window, console, document, chrome*/
(function () {
    var requestUrl = function () {
        var deviceIp, devicePort, xmlhttp;
        deviceIp = window.localStorage.getItem("smsdeviceip");
        devicePort = window.localStorage.getItem("smsdeviceport");
        xmlhttp = new window.XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            var code, callbackForQuery;
            callbackForQuery = function (tabs) {
                var i;
                for (i = 0; i < tabs.length; i += 1) {
                    console.log(tabs[i].url);
                    chrome.tabs.sendMessage(tabs[i].id, {verifycode: code});
                }
            };
            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status === 200) {
                    console.log("ResponseText:" + xmlhttp.responseText);
                    code = /[0-9]+/.exec(xmlhttp.responseText)[0];
                    console.log("code=" + code);
                    chrome.tabs.query({url: "http://www.bjguahao.gov.cn/comm/*"}, callbackForQuery);
                    requestUrl();
                } else {
                    console.log("device is not available.");
                    window.setTimeout(requestUrl, 5000);
                }
            }
        };
        xmlhttp.open("GET", "http://" + deviceIp + ":" + devicePort, true);
        xmlhttp.send(null);
    };
    requestUrl();
}());
