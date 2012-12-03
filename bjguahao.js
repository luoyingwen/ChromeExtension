//http://www.bjguahao.gov.cn/comm/beiyi3/guahao.php?hpid=142&ksid=1110101&datid=83033&wday=&sx=1&eday=2012-12-04
(function(){
	var fullURL = document.URL.toString();
	var isGuaHao = (fullURL.search("guahao.php") > 0);
	if (isGuaHao){
		console.log("In guahao.php page");
		const TIMER_INTERVAL_MS = 100;
        var submitFunc = function(){
			var inputArray = document.getElementsByTagName("input");
			for (var i = 0; i < inputArray.length; i++)
			{
				var oneInput = inputArray[i];
				if ( oneInput.value === "点击获取" && oneInput.type === "button")
				{
					console.log("found target button");
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
								}
							  }, 
							  TIMER_INTERVAL_MS);
					break;
				}
			}
		};
        submitFunc();
	}
})();


//http://www.bjguahao.gov.cn/comm/beiyi3/ksyy.php?ksid=1110101&hpid=142&wday=&sx=1&eday=2012-12-04
(function(){
	var fullURL = document.URL.toString();
	var isksyy = (fullURL.search("ksyy.php") > 0);
	if (isksyy){
		console.log("In ksyy.php");
        var TARGET_DATE = "2012-12-11";
        var isTargetDate = (fullURL.search(TARGET_DATE) > 0);
        if (isTargetDate)
        {
            console.log("In Target Date page");
            var bookFunc = function(){
                var anchorArray = document.getElementsByTagName("a");
                console.log(anchorArray.length);
                for (var i = 0; i < anchorArray.length; i++){
                    var oneAnchor = anchorArray[i];
                    var trInnerText = oneAnchor.parentNode.parentNode.innerText.toString();
                    if (oneAnchor.text === "预约挂号" && trInnerText.search("颈椎") != -1 && trInnerText.search("14.00") != -1){
                        console.log(trInnerText);
                        oneAnchor.click();
                        break;
                    }
                }		
            };
            bookFunc();
            setInterval(function(){document.location.reload(true);}, 500);
        }
	}
})();