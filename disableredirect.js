// ==UserScript==
// @id             remove_google_redirection@google.com
// @name           Remove Google Redirection
// @namespace      http://dango-akachan.appspot.com
// @description    Remove Google redirection, Disable click-tracking in Google search result, and repair Google cache links (because of GFW) 
// @author         tuantuan <dangoakachan@gmail.com>
// @homepage       http://dango-akachan.appspot.com
// @version        0.7
// @include        http://www.google.*/search*
// @include        http://www.google.*/*sclient=psy*
// @include        http://ipv6.google.com/search*
// @include        https://www.ggssl.com/search*
// @include        http://groups.google.com/groups/search*
// @include        https://groups.google.com/groups/search*
// ==/UserScript==

/*
 * This scripts has these following features:
 * a. Disable click-tracking in Google search result.
 * b. Repair Google cache with gggssl.com
 * c. Remove Google redirection, restore the url from
 *      "http://www.google.com/url?url=http://example.com" 
 *    to 
 *      "http://example.com" 
 *
 * Now Support:
 * a. Google search (including news search)
 * b. Google Groups search
 *
 * Problem:
 * a. Not work very well with Google Instant
 * 
 * Changelog:
 * version 0.7
 * a. Add tooltip to each link.
 *
 * version 0.6 13/03/2011
 * a. Code optimization.
 * b. Fix a bug in Google Instant with "show more results from .."
 *
 * version 0.5 12/03/2011
 * a. Fix a bug with "Show more results from .."
 *
 * version 0.4 12/03/2011
 * a. More accurate and faster to find links that needed to be 
 *    processed by using XPath.
 * b. Optimize code structure.
 * 
 * version 0.3 09/03/2011
 * a. Add event listener to "hashchange" instead of "DOMAttrModified".
 * b. Add Google Group search support.
 */

function base_process() 
{
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

        //Google cache repair
        if (l.href.indexOf("http://webcache.googleusercontent.com") != -1)
            l.href = l.href.replace("http://webcache.googleusercontent.com", 
                "https://www.ggssl.com/cache");

        // Add tooltip to each link
        if (!l.hasAttribute("title"))
            l.setAttribute("title", l.href);
    }
}


function process()
{
    base_process();  
}
if(window.addEventListener ) 
{
	console.log("window.addEventListener ");
	window.addEventListener( 'hashchange', process, false );
}
else if ( window.attachEvent ) {
	console.log("window.attachEvent ");
	window.attachEvent( 'onhashchange', process );
}
process();