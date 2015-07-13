(function () {
	var menuClick = function (info, tab) 
	{
		var valStr = "http://dictionary.reference.com/browse/" + info.selectionText;
		chrome.tabs.create({url:valStr});
	}	  
	// Create context menu item for link.
	var title = "check in wiktionary";
	var id = chrome.contextMenus.create({"title": title, "contexts":["selection", "link"], "onclick": menuClick});
})();




