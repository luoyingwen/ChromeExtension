//this function for submit page

(function(){
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
				oneInput.click();

				var timeridSubmit = setInterval(function(){
							var inputText = document.getElementById("dxcode1");
							if (inputText.value.toString().length === 4)
							{
								console.log(inputText.value);
								clearInterval(timeridSubmit);
								var submitbtn = document.getElementById("button2");
								console.log(submitbtn.value);
								submitbtn.click();
								console.log("submit form2");
								//document.location.reload(true);
							}
						  }, 
						  TIMER_INTERVAL_MS);
				break;
			}
		}
	},
	TIMER_INTERVAL_MS);

})();


(function(){
	console.log("new function3");
	const TIMER_INTERVAL_MS = 100;
	var timeridBook = setInterval(function(){
		var anchorArray = document.getElementsByTagName("a");
		console.log(anchorArray.length);
		var i = 0;
		for (i = 0; i < anchorArray.length; i++){
			var oneAnchor = anchorArray[i];
			console.log(oneAnchor.text);
			if (oneAnchor.text === "预约挂号"){
				clearInterval(timeridBook);
				break;
			}
		}
		if ( i === anchorArray.length ){
			document.location.reload(true);
		}		
	},
	TIMER_INTERVAL_MS);
})();