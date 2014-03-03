/*global window, console, document, chrome*/
(function () {
    var TIMER_INTERVAL, MAX_CALLBACK_COUNT, timerid, timecallbackcount, process, contentchanged, timercallback;

    TIMER_INTERVAL = 2000;//ms, too long maybe not handle before user click.
                                //too small maybe content not ready between content change and document ready
    MAX_CALLBACK_COUNT = 10;//call callback max count. if not stop, will comsume cpu and reduce computer performance

    timerid = 0;
    timecallbackcount = 0;

    process = function () {
        //console.log("disableredirect process");
        var len, i, l, value;
        len = document.links.length;
        for (i = 0; i < len; i += 1) {
            l = document.links[i];

            //Remove click tracking
            if (l.hasAttribute("onmousedown")) {
                value = l.getAttribute("onmousedown");

                if (value.indexOf("return") !== -1) {
                    l.removeAttribute("onmousedown");
                }
            }

            // Add tooltip to each link
            if (!l.hasAttribute("title")) {
                l.setAttribute("title", l.href);
            }
        }
    };
    timercallback = function () {
        //console.log("timercallback");
        if (timecallbackcount > MAX_CALLBACK_COUNT) {
            window.clearInterval(timerid);
            timecallbackcount = 0;
            timerid = 0;
        } else {
            timecallbackcount += 1;
        }
        process();
    };

    contentchanged = function () {
        //console.log("contentchanged");
        if (timerid !== 0) {
            window.clearInterval(timerid);
            timecallbackcount = 0;
            timerid = 0;
        }
        timerid = window.setInterval(function () { timercallback(); }, TIMER_INTERVAL);
        //console.log(timerid);
        process();
    };

    if (window.addEventListener) {
        console.log("window.addEventListener ");
        window.addEventListener('hashchange', contentchanged, false);
    } else if (window.attachEvent) {
        console.log("window.attachEvent");
        window.attachEvent('onhashchange', contentchanged);
    }
    contentchanged();
}());