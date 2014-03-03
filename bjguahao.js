/*global window, console, document, chrome*/
(function () {
    var curUrl, getLatestGuaHaoInfo, latestElement, setDate2NextDay, getEleByTagNameAndOnclickSig, getCodeEle;
    curUrl = document.location.href.toString();
    console.log(curUrl);
    if (curUrl.search("content.php") !== -1) {
        console.log("found content.php");

        getLatestGuaHaoInfo = function () {
            var arrHref, lastestUrl, i, tempUrl, targetElement;
            arrHref = document.getElementsByTagName("a");
            for (i = 0; arrHref && i < arrHref.length; i += 1) {
                tempUrl = arrHref[i].href ? arrHref[i].href.toString() : "";
                if (tempUrl.search("ghao.php") !== -1) {
                    if (!lastestUrl || lastestUrl < tempUrl) {
                        lastestUrl = tempUrl;
                        targetElement = arrHref[i];

                        console.log("lastesturl=" + lastestUrl);
                    }
                }
            }
            return targetElement;
        };
        latestElement = getLatestGuaHaoInfo();

        setDate2NextDay = function (element) {
            var nextDay, dateInfo, lastestUrl;
            if (element) {
                dateInfo = /(.+)([0-9]{4,4})-([0-9]{1,2})-([0-9]{1,2})/.exec(element.href.toString());
                if (dateInfo && dateInfo.length === 5) {
                    //nextDay = new Date(parseInt(dateInfo[2]), parseInt(dateInfo[3]) - 1, parseInt(dateInfo[4]) + 1);
                    nextDay = new Date(parseInt(dateInfo[2], 10), parseInt(dateInfo[3], 10) - 1, parseInt(dateInfo[4], 10));
                    console.log(nextDay);
                    lastestUrl = dateInfo[1] + nextDay.getFullYear() + "-" + (parseInt(nextDay.getMonth(), 10) + 1).toString() + "-" + nextDay.getDate();
                    console.log(lastestUrl);
                    element.href = lastestUrl;
                }
            }
        };
        if (latestElement) {
            setDate2NextDay(latestElement);
            console.log(latestElement.href);
            latestElement.click();
        } else {
            console.log("can not find targetElement");
        }
    } else if (curUrl.search("ghao.php") !== -1) {
        console.log("found ghao.php");
        if (document) {
            (function () {
                var allItem, i, hrefElement, foundElement = false;
                allItem = document.getElementsByTagName("tr");

                for (i = 0; i < allItem.length; i += 1) {
                    console.log(allItem[i].innerText);
                    hrefElement = allItem[i].getElementsByTagName("a")[0];
                    if (hrefElement) {
                        console.log(hrefElement.href);
                        //foundElement = true;
                        //break;
                    }
                }
                if (foundElement) {
                    hrefElement.click();
                } else {
                    document.location.reload();
                }
            }());
        } else {
            console.log("can not find document object");
        }
    } else if (curUrl.search("guahao.php") !== -1) {
        console.log("found guahao.php");
        getEleByTagNameAndOnclickSig = function (tagName, signature) {
            var allItem, i, valueContent, srcContent;
            allItem = document.getElementsByTagName(tagName);
            for (i = 0; i < allItem.length; i += 1) {
                valueContent = allItem[i].value;
                srcContent = allItem[i].src;
                if (
                    (valueContent && valueContent.toString().search(signature) !== -1) ||
                        (srcContent && srcContent.toString().search(signature) !== -1)
                ) {
                    console.log("found Element");
                    return allItem[i];
                }
            }
            return null;
        };
        getCodeEle = getEleByTagNameAndOnclickSig("input", "点击获取");
        if (getCodeEle) {
            console.log("call getcode.");
            getCodeEle.click();
        }
        chrome.runtime.onMessage.addListener(
            function (request) {
                var submitEle, dxCode;
                console.log("verifycode=" + request.verifycode);
                document.getElementById("dxcode1").value = request.verifycode + "hello";

                submitEle =  getEleByTagNameAndOnclickSig("img", "queren");
                dxCode = document.getElementById("dxcode1").value;
                if (submitEle && dxCode && dxCode.toString().length > 0) {
                    console.log("click submit button.");
                    submitEle.click();
                }
            }
        );
    } else {
        console.log("do nothing.");
    }
}());