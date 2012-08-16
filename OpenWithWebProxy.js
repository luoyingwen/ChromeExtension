
var protocalPrefix = "http://";
var proxyUrl = "https://webserverfordream.appspot.com";

function IsWebProxyUrl(url)
{
    if(url.length <= 0)
        return 0;

    if(url.indexOf(proxyUrl) == 0 )
    {
        return 1;
    }

    return 0;
}
// Called when the url of a tab changes.
function tabUrlChanged(tabId, changeInfo, tab) 
{
    var validurl = tab.url;
    if (
        validurl.length > 0 
        && validurl.indexOf(protocalPrefix) == 0
        && (!IsWebProxyUrl(validurl))
        )
    {
        chrome.pageAction.show(tabId);
    }
}

function getwrapperurl(oriurl)
{
    if (
        oriurl.length <= 0 
        || oriurl.indexOf(protocalPrefix) != 0
        || IsWebProxyUrl(oriurl) 
        )
    {
        return oriurl;
    }

    var str = oriurl.substr(protocalPrefix.length);
    encodedurl = proxyUrl + "/" + str;
    return encodedurl;
}

function webProxyIconClick(tab)
{ 
    var valStr = getwrapperurl(tab.url);
    chrome.tabs.update(tab.id,{"url":valStr, "selected":true});
}

function contextMenuClick(info, tab) 
{
    var valStr = getwrapperurl(info.linkUrl);
    chrome.tabs.create({url:valStr});
}

function requestReached(url, sender, sendResponse)
{
    var status = 1;//1 domain range; 2 port range; 3 real domain;0 break

    var prefix = "https://";
    var startPos = prefix.length;
    var rangeB = 0;
    var domain = "";
    var real_domain = "";

    while(status != 0 && startPos < url.length)
    {
        if( status == 1)
        {
            if(url.charAt(startPos) == '/')
            {
                domain = url.substr(rangeB, startPos - rangeB);
                console.log("status = 3" + domain);
                status = 3;
                rangeB = startPos + 1;
            }
            else if(url.charAt(startPos) == ':')
            {
                domain = url.substr(rangeB, startPos - rangeB);
                console.log("status = 2" + domain);
                status = 2;
            }
        }
        else if( status == 2)
        {
            if(url.charAt(startPos) == '/')
            {
                status = 3;
                rangeB = startPos + 1;
            }
        }
        else if( status == 3)
        {
            if(url.charAt(startPos) == '/')
            {
                status = 0;
                real_domain = url.substr(rangeB, startPos - rangeB);
                console.log("status = 0" + real_domain);
            }
        }
        startPos++;
        console.log(startPos);
    }
    if(status == 3)
        real_domain = url.substr(rangeB, startPos - rangeB);

    
    if(real_domain.indexOf(".") != -1)
    {
        chrome.cookies.set({"url":domain, "name":"real_domain", "value":real_domain});
    }
}

// Create one test item for each context type.
var title = "open with web proxy";
var id = chrome.contextMenus.create({"title": title, "contexts":["link"], "onclick": contextMenuClick});

chrome.pageAction.onClicked.addListener(webProxyIconClick);
// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(tabUrlChanged);

chrome.extension.onRequest.addListener(requestReached);


