
var protocalPrefix = "http://";
var proxyUrl = "https://hellocockroach.appspot.com";

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

//get mirror domain
//examples: 
//1. https://hellocockroach.appspot.com/www.cnbeta.com/aaa.xxx => real_domain=www.cnbeta.com
//2. https://hellocockroach.appspot.com/www.cnbeta.com/aaa.xxx => real_domain=www.cnbeta.com
//3. https://hellocockroach.appspot.com/www.cnbeta.com/ => real_domain=www.cnbeta.com
//4. https://hellocockroach.appspot.com/www.cnbeta.com => real_domain=www.cnbeta.com
// skip process:
// https://hellocockroach.appspot.com/www.bbb.com[:8080]/aaa.xxx
//status: 1                          2                  0 =>break
//range:                             rangeB             startPos
function requestReached(url, sender, sendResponse)
{
    console.log("requestReached. url=" + url);
    var status = 1;

    var prefix = "https://";
    var startPos = prefix.length;
    var rangeB = 0;
    var domain = "";
    var real_domain = "";

    while(startPos < url.length)
    {
        if( status == 1)
        {
            if(url.charAt(startPos) == '/')
            {
                domain = url.substr(rangeB, startPos - rangeB);
                console.log("status = 1 :" + domain);
                status = 2;
                rangeB = startPos + 1;
            }
        }
        else if( status == 2)
        {
            if(url.charAt(startPos) == '/')
            {
                status = 0;
                real_domain = url.substr(rangeB, startPos - rangeB);
                console.log("status = 2 :" + real_domain);
                break;
            }
        }
        else
        {
            console.log("Never reach here.");
            break;
        }
        startPos++;
    }
    if(status == 2)
        real_domain = url.substr(rangeB, startPos - rangeB);

    if(real_domain.indexOf(".") != -1)
    {
        console.log("set cookie. real_domain:" + real_domain);
        chrome.cookies.set({"url":domain, "name":"real_domain", "value":real_domain});
    }
}
  
// Create context menu item for link.
var title = "open with web proxy";
var id = chrome.contextMenus.create({"title": title, "contexts":["link"], "onclick": contextMenuClick});

//click handler from page action button of address bar
chrome.pageAction.onClicked.addListener(webProxyIconClick);
// Listen for any changes to the URL of any tab. show or hide page action button
chrome.tabs.onUpdated.addListener(tabUrlChanged);

// cookie set from changeCookie of content script 
chrome.extension.onMessage.addListener(requestReached);


