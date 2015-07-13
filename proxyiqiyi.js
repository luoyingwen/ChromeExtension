(function () {
    var videoinfo;
    var intervalid;
    var insertscript = function () {
        var script = document.createElement('script');
        script.src = chrome.extension.getURL("iqiyi.js");
        document.head.appendChild(script);
    };
    var insertdataelement = function () {
        var video = document.createElement('videourl');
        document.body.appendChild(video);
        videoinfo = video;
    };
    insertdataelement();
    insertscript();
    var interval = function () {
        var videourl = videoinfo.getAttribute("url");
        if (videourl) {
            console.log(videourl);
            chrome.runtime.sendMessage({name:"2", url: videourl});
            clearInterval(intervalid);
        }
        else {
            console.log("url not ready");
        }
    };
    intervalid = setInterval(interval, 2000);
})();