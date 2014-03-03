/*global window, console, document, chrome*/
(function () {
    var sleep, changeCookie;
    sleep = function (n) {
        var start = new Date().getTime();
        while (true) {
            if (new Date().getTime() - start > n) {
                break;
            }
        }
    };

    changeCookie = function () {
        var url = document.URL;
        console.log("send message to tool extension");
        chrome.extension.sendMessage(url);
        sleep(1000);//why ?
    };

    changeCookie();
}());

