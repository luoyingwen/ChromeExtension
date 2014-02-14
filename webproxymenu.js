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
		var getUrlWithoutScheme = function () {
			var parse_url = /^([A-Za-z]+):(\/{0,3})(.+)/;
			var result = parse_url.exec(oriUrl);
			return result[3];
		}
		if ( oriUrl.indexOf(proxyUrl) === -1) {
			return proxyUrl + "/" + getUrlWithoutScheme();
		}
		else {//start with proxyUrl
			var realUrl = oriUrl.replace(proxyUrl, "");//remove proxyUrl at the beginning
			realUrl = realUrl && realUrl.substr(1);//escape / with substr
			if ( realUrl ) {
				//now realUrl is similar to www.google.com.hk/url?q=https://www.hello-world.com/&sa=U&ei=f8H9UpzwB4a4qQHU-4DQAQ&ved=0CD0QFjAH&usg=AFQjCNGWubV5n2gG57mWqqJaWdUVFNBUZg
				//we need to extract https://www.hello-world.com/
				var parse_url = /^([0-9.\-A-Za-z]+)\/url[?]q=([^&]+)/;
				var result = parse_url.exec(realUrl);
				if (result[2]) {
					console.log("found a search url. Value=" + result[2]);
					return result[2];
				}
			}
			
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
