(function () {
	var baiduMenu = function (info, tab) 
	{
		var valStr = "http://cidian.baidu.com/s?wd=" + info.selectionText;
		chrome.tabs.create({url:valStr});
	}	  
	// Create context menu item for link.
	var title = "open baidu cidian";
	var id = chrome.contextMenus.create({"title": title, "contexts":["selection", "link"], "onclick": baiduMenu});
})();




