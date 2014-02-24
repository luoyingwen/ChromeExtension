(function () {
	var curUrl = document.location.href.toString();
	console.log(curUrl);
	if (curUrl.search("content.php") !== -1) {
		console.log("found content.php");
        
        var getLatestGuaHaoInfo = function () {
    		var lastestUrl;
            var i;
    		var tempUrl;
            var targetElement;
            var arrHref = document.getElementsByTagName("a");
            for (i = 0; arrHref && i < arrHref.length; i++) {
                tempUrl = arrHref[i].href ? arrHref[i].href.toString() : "";
                if (tempUrl.search("ghao.php") !== -1) {
                    if (!lastestUrl || lastestUrl < tempUrl){
                        lastestUrl = tempUrl;
                        targetElement = arrHref[i];
                        
                        console.log("lastesturl=" + lastestUrl);
                    }
                }
            }
            return targetElement;
        }
        var latestElement = getLatestGuaHaoInfo();
        
        var setDate2NextDay = function (element) {
            var nextDay;
            var dateInfo;
            var lastestUrl;
            if (element) {
                dateInfo = /(.+)([0-9]{4,4})-([0-9]{1,2})-([0-9]{1,2})/.exec(element.href.toString());
                if (dateInfo && dateInfo.length === 5) {
                    //nextDay = new Date(parseInt(dateInfo[2]), parseInt(dateInfo[3]) - 1, parseInt(dateInfo[4]) + 1);
                    nextDay = new Date(parseInt(dateInfo[2]), parseInt(dateInfo[3]) - 1, parseInt(dateInfo[4]));
                    console.log(nextDay);
                    lastestUrl = dateInfo[1] + nextDay.getFullYear() + "-" + (parseInt(nextDay.getMonth()) + 1).toString() + "-" + nextDay.getDate();
                    console.log(lastestUrl);
                    element.href = lastestUrl;
                }
            }
        }		
		if (latestElement) {

			setDate2NextDay(latestElement);
			console.log(latestElement.href);
			latestElement.click();
		}
		else {
			console.log("can not find targetElement");
		}
	}
	else if (curUrl.search("ghao.php") !== -1) {
		console.log("found ghao.php");
	}
	else {
		chrome.runtime.onMessage.addListener(
			function(request, sender, sendResponse) {
			console.log(sender.tab ?
					"from a content script:" + sender.tab.url :
					"from the extension");
			console.log("verifycode=" + request.verifycode);
			}
		);
	}
})();