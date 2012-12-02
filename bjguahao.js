//this function for submit page
//http://www.bjguahao.gov.cn/comm/beiyi3/guahao.php?hpid=142&ksid=1110101&datid=83033&wday=&sx=1&eday=2012-12-04
(function(){
	var fullURL = document.URL.toString();
	console.log(fullURL);
	var isGuaHao = (fullURL.search("guahao.php") > 0);
	if (isGuaHao){
		console.log("In guahao.php page");
		const TIMER_INTERVAL_MS = 100;
		var timeridGetCode = setInterval(function(){
			var inputArray = document.getElementsByTagName("input");
			for (var i = 0; i < inputArray.length; i++)
			{
				var oneInput = inputArray[i];
				if ( oneInput.value === "点击获取" && oneInput.type === "button")
				{
					console.log("found target button");
					clearInterval(timeridGetCode);
					//oneInput.click();

					var timeridSubmit = setInterval(function(){
								var inputText = document.getElementById("dxcode1");
								if (inputText.value.toString().length === 4)
								{
									console.log(inputText.value);
									clearInterval(timeridSubmit);
									var submitbtn = document.getElementById("button2");
									console.log(submitbtn.value);
									//submitbtn.click();
									console.log("submit form2");
								}
							  }, 
							  TIMER_INTERVAL_MS);
					break;
				}
			}
		},
		TIMER_INTERVAL_MS);
	}

})();


//http://www.bjguahao.gov.cn/comm/beiyi3/ksyy.php?ksid=1110101&hpid=142&wday=&sx=1&eday=2012-12-04
(function(){
	console.log("new function3");
	var fullURL = document.URL.toString();
	console.log(fullURL);
	var isksyy = (fullURL.search("ksyy.php") > 0);
	if (isksyy){
		console.log("In ksyy.php");
		const TIMER_INTERVAL_MS = 100;
		var timeridBook = setInterval(function(){
			var anchorArray = document.getElementsByTagName("tr");
			console.log(anchorArray.length);
			var i = 0;
			for (i = 0; i < anchorArray.length; i++){
				var oneAnchor = anchorArray[i];
				console.log(oneAnchor.text);
				if (oneAnchor.text === "预约挂号"){
					clearInterval(timeridBook);
					console.log(oneAnchor.href);
					console.log(oneAnchor.parentNode.parentNode.text);
					//oneAnchor.click();
					break;
				}
			}
			if ( i === anchorArray.length ){
				document.location.reload(true);
			}		
		},
		TIMER_INTERVAL_MS);
	}
})();