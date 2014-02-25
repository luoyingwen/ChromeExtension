( function () {
	var requestUrl = function () {
		var deviceIp, devicePort;
		deviceIp = window.localStorage["smsdeviceip"];
		devicePort = window.localStorage["smsdeviceport"];
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function () {
			var code;
			var callbackForQuery = function (tabs) {
				var i;
				for (i = 0; i < tabs.length; i++) {
					console.log(tabs[i].url);
					chrome.tabs.sendMessage(tabs[i].id, {verifycode: code});
				}
			};
			if (xmlhttp.readyState === 4) {
				if (xmlhttp.status === 200) {
					console.log("ResponseText:" + xmlhttp.responseText);
					code = /[0-9]+/.exec(xmlhttp.responseText)[0];
					console.log("code=" + code);
					chrome.tabs.query({url:"http://www.bjguahao.gov.cn/comm/*"}, callbackForQuery);
					requestUrl();
				}
				else {
					console.log("device is not available.");
					setTimeout(requestUrl, 5000);
				}				
			}
		};
		xmlhttp.open("GET", "http://" + deviceIp + ":" + devicePort, true);
		xmlhttp.send(null);
	};
	requestUrl();
} )();
