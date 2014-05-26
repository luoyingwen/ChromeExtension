/*global window, console, document, chrome*/
(function () {
    var proxyUrl, tabUrlCreated, tabUrlChanged, getwrapperurl, webProxyIconClick, contextMenuClick, requestReached, title;
    proxyUrl = "https://hellocockroach.appspot.com";

    tabUrlCreated = function (tab) {
    };

    tabUrlChanged = function (tabId, changeInfo, tab) {
        var extractRealUrl, extractFromSearch;
        extractFromSearch = function (url) {
            var parseSearch, result;
            parseSearch = /^([A-Za-z]+):(\/{0,3})(www[.]google[.a-z]+)\/url[?][a-zA-Z0-9&=]+url=([^&]+)/;
            result = parseSearch.exec(url);
            if (result) {
                return decodeURIComponent(result[4]);
            }
            return "";
        };
        if (tab.url && tab.url.indexOf(proxyUrl) === -1) {
            chrome.pageAction.show(tabId);
            extractRealUrl = extractFromSearch(tab.url);
            if (extractRealUrl) {
                console.log("original url is from search engine, real url is " + extractRealUrl);
                chrome.tabs.update(tabId, {"url": extractRealUrl, "selected": true});
            }
        }

    };

    getwrapperurl = function (oriUrl) {
        var getGoogleQueryWords, getUrlWithoutScheme, googleQueryWords;
        getGoogleQueryWords = function (url) {
            var parse_url, result;
            parse_url = /^([A-Za-z]+):(\/{0,3})(www[.]google[.a-z]+)\/search.*[&?]q[=]([^&]+)/;
            result = parse_url.exec(url);
            if (result) {
                return result[4];
            }
            return "";
        };
        getUrlWithoutScheme = function (url) {
            var parse_url, result;
            parse_url = /^([A-Za-z]+):(\/{0,3})(.+)/;
            result = parse_url.exec(url);
            return result[3];
        };
        if (oriUrl.indexOf(proxyUrl) === -1) {
            googleQueryWords = getGoogleQueryWords(oriUrl);
            if (googleQueryWords) {
                googleQueryWords = googleQueryWords.replace("+", "%20");
                return "http://www.baidu.com/#wd=" + googleQueryWords;
            }
            return proxyUrl + "/" + getUrlWithoutScheme(oriUrl);
        }
        return oriUrl;
    };

    webProxyIconClick = function (tab) {
        var valStr = getwrapperurl(tab.url);
        chrome.tabs.update(tab.id, {"url": valStr, "selected": true});
    };

    contextMenuClick = function (info, tab) {
        var valStr = getwrapperurl(info.linkUrl);
        chrome.tabs.create({url: valStr});
    };

    //called from content script
    requestReached = function (url, sender, sendResponse) {
        var parse_url, result, domain, real_domain;
        console.log("requestReached. url=" + url);
        parse_url = /^([A-Za-z]+):(\/{0,3})([0-9.\-A-Za-z]+)(?:\/([0-9.\-A-Za-z]+))/;
        result = parse_url.exec(url);
        domain = result[3];
        real_domain = result[4];
        console.log("domain:" + domain + " real_domain:" + real_domain);

        if (real_domain && real_domain.indexOf(".") !== -1) {
            console.log("set cookie. real_domain:" + real_domain);
            chrome.cookies.set({"url": domain, "name": "real_domain", "value": real_domain});
        }
    };

    // Create context menu item for link.
    title = "open with web proxy";
    chrome.contextMenus.create({"title": title, "contexts": ["link"], "onclick": contextMenuClick});

    //click handler from page action button of address bar
    chrome.pageAction.onClicked.addListener(webProxyIconClick);
    // Listen for any changes to the URL of any tab. show or hide page action button
    chrome.tabs.onUpdated.addListener(tabUrlChanged);
    chrome.tabs.onCreated.addListener(tabUrlCreated);

    // cookie set from changeCookie of content script
    chrome.extension.onMessage.addListener(requestReached);
}());
