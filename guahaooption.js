var deviceMgr = (function () {
	var smsDeviceIpKey = "smsdeviceip";
	var smsDevicePortKey = "smsdeviceport";
	return {
		getIp:function () {
			console.log("getIp");
			return window.localStorage[smsDeviceIpKey];
		},
		setIp:function (value) {
			console.log("setIp");
			window.localStorage[smsDeviceIpKey] = value;
			return this.getIp();
		},
		getPort:function () {
			console.log("getPort");
			return window.localStorage[smsDevicePortKey];
		},
		setPort:function (value) {
			console.log("setPort");
			window.localStorage[smsDevicePortKey] = value;
			return this.getPort();
		}
	};
})();

document.addEventListener('DOMContentLoaded', function () {
	document.getElementById("btn_submit").onclick = function () {
		var requestUrl = function (testIp, testPort) {
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.onreadystatechange = function () {
				if (xmlhttp.readyState === 4) {
					if (xmlhttp.status === 200) {
						deviceMgr.setIp(testIp);
						deviceMgr.setPort(testPort);
						document.getElementById("show_status").innerText = "update device info successfully.";
					}
					else {
						document.getElementById("show_status").innerText = "device is not available.";
					}
				}
			};
			xmlhttp.open("GET", "http://" + testIp + ":" + testPort, true);
			xmlhttp.send(null);
		};
		document.getElementById("show_status").innerText = "waiting...";
		requestUrl(document.getElementById("edit_ip").value, document.getElementById("edit_port").value);
	};
	
	document.getElementById("edit_ip").value = deviceMgr.getIp();
	document.getElementById("edit_port").value = deviceMgr.getPort();
});
console.log("Initialized.");



