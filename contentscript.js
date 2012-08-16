function sleep(n)
{
    var start = new Date().getTime();
    while(true)
    {
        if( new Date().getTime() - start > n)
            break;
    }
}

function changeCookie()
{
    var url = document.URL;

    chrome.extension.sendRequest(url);
    sleep(1000);
}

changeCookie();

