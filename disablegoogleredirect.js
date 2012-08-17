
const TIMER_INTERVAL = 2000;//ms, too long maybe not handle before user click. 
                            //too small maybe content not ready between content change and document ready
const MAX_CALLBACK_COUNT = 10;//call callback max count. if not stop, will comsume cpu and reduce computer performance

var timerid = 0;
var timecallbackcount = 0;

function process() 
{
    //console.log("disableredirect process");
    var len = document.links.length;
    for (var i=0; i < len; i++) {
        var l = document.links[i];

        //Remove click tracking 
        if (l.hasAttribute("onmousedown"))
        {
              var value = l.getAttribute("onmousedown");
              
              if(value.indexOf("return") != -1)
              {
                 l.removeAttribute("onmousedown");
              }
        }

        // Add tooltip to each link
        if (!l.hasAttribute("title"))
            l.setAttribute("title", l.href);
    }
}

function contentchanged()
{
    //console.log("contentchanged");
    if (timerid != 0)
    {
        clearInterval(timerid);
        timecallbackcount = 0;
        timerid = 0;
    }
    timerid = setInterval(function(){timercallback()}, TIMER_INTERVAL);
    //console.log(timerid);
    process();
}

function timercallback()
{
    //console.log("timercallback");
    if ( timecallbackcount > MAX_CALLBACK_COUNT)
    {
        clearInterval(timerid);
        timecallbackcount = 0;
        timerid = 0;
    }
    else
    {
        timecallbackcount++;
    }
    process();
}

if(window.addEventListener ) 
{
    console.log("window.addEventListener ");
    window.addEventListener( 'hashchange', contentchanged, false );
}
else if ( window.attachEvent ) {
    console.log("window.attachEvent ");
    window.attachEvent( 'onhashchange', contentchanged );
}
contentchanged();