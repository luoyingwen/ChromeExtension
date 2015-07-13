/*global window, console, document, chrome*/
(function () {
    var requestUrl = function (videoinfo) {
        var xmlhttp;
        var encodedurl = encodeURIComponent(videoinfo.url);
        xmlhttp = new window.XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status === 200) {
                    console.log("ResponseText:" + xmlhttp.responseText);

                } else {
                    console.log("device is not available.");
                }
            }
        };
        //xmlhttp.open("GET", "http://ec2-54-148-2-138.us-west-2.compute.amazonaws.com:8080/", true);
        console.log(encodedurl);
        xmlhttp.open("GET", "http://127.0.0.1:8080/iqiyi/video/url/insert?url=" + encodedurl + "&name=" + videoinfo.name, true);
        xmlhttp.send(null);
    };
    
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            console.log(sender.tab ?
                        "from a content script:" + sender.tab.url :
                        "from the extension");
            console.log(request);
            requestUrl(request);
        }
    );
}());
