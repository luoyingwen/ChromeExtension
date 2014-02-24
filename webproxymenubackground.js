(function () {
	var protocalPrefix = "http://";
	var proxyUrl = "https://hellocockroach.appspot.com";

	function tabUrlChanged(tabId, changeInfo, tab) {
		var validurl = tab.url;
		if ( tab.url && tab.url.indexOf(proxyUrl) === -1) {
			chrome.pageAction.show(tabId);
		}
	}

	function getwrapperurl(oriUrl) {
		var getGoogleQueryWords = function (url) {
			var parse_url = /^([A-Za-z]+):(\/{0,3})(www[.]google[.][^/]+)\/search.*[&?]q[=]([^&]+)/;				
			var result = parse_url.exec(url);
			if (result ) {
				return result[4];
			}
			else {
				return "";
			}
		}
		var getUrlWithoutScheme = function (url) {
			var parse_url = /^([A-Za-z]+):(\/{0,3})(.+)/;
			var result = parse_url.exec(url);
			return result[3];
		}
		var googleQueryWords = null;
		if ( oriUrl.indexOf(proxyUrl) === -1) {
			googleQueryWords = getGoogleQueryWords(oriUrl);
			if (googleQueryWords) {
				googleQueryWords = googleQueryWords.replace("+", "%20");
				return "http://www.baidu.com/#wd=" + googleQueryWords;
			}
			else {
				return proxyUrl + "/" + getUrlWithoutScheme(oriUrl);
			}
		}
		else {//start with proxyUrl
			return oriUrl;
		}		
	}

	function webProxyIconClick(tab)	{ 
		var valStr = getwrapperurl(tab.url);
		chrome.tabs.update(tab.id,{"url":valStr, "selected":true});
	}

	function contextMenuClick(info, tab) {
		var valStr = getwrapperurl(info.linkUrl);
		chrome.tabs.create({url:valStr});
	}

	//called from content script
	function requestReached(url, sender, sendResponse) {
		console.log("requestReached. url=" + url);
		var parse_url = /^([A-Za-z]+):(\/{0,3})([0-9.\-A-Za-z]+)(?:\/([0-9.\-A-Za-z]+))/;
		var result = parse_url.exec(url);
		var domain = result[3];
		var real_domain= result[4];
		console.log("domain:" + domain + " real_domain:" + real_domain);

		if(real_domain && real_domain.indexOf(".") != -1) {
			console.log("set cookie. real_domain:" + real_domain);
			chrome.cookies.set({"url":domain, "name":"real_domain", "value":real_domain});
		}
	}
	  
	// Create context menu item for link.
	var title = "open with web proxy";
	var id = chrome.contextMenus.create({"title": title, "contexts":["link"], "onclick": contextMenuClick});

	//click handler from page action button of address bar
	chrome.pageAction.onClicked.addListener(webProxyIconClick);
	// Listen for any changes to the URL of any tab. show or hide page action button
	chrome.tabs.onUpdated.addListener(tabUrlChanged);

	// cookie set from changeCookie of content script 
	chrome.extension.onMessage.addListener(requestReached);
})();
