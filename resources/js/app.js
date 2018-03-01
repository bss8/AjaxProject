/*
   Website JS code for Ajax Project
   Author: Boris
 */

function load (url, objectId) {
    var pageRequest = false;

    /* Boilerplate to check for browser type
        If webkit, first if condition. Else if IE
     */
    if (window.XMLHttpRequest)
        pageRequest = new XMLHttpRequest();
    else if (window.ActiveXObject){
        try {
            pageRequest = new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch (e){
            try{
                pageRequest = new ActiveXObject("Microsoft.XMLHTTP");
            }
            catch (e){}
        }
    }
    else
        return false;
    pageRequest.onreadystatechange = function() {
        console.log("pageRequest: " + pageRequest + "objectId: " + objectId);
        loadPage(pageRequest, objectId);
    };
    //asynchronous request
    pageRequest.open('GET', url, true);
    pageRequest.send(null)
}

function loadPage(pageRequest, objectId) {
    var x = document.getElementById(objectId);
    /*  == may cause unexpected type coercion, so using ===
        if readyState is 4 (DONE) and status is 200 OK or we are running locally (not in http but perhaps C:)
     */
    if (pageRequest.readyState === 4 && (pageRequest.status === 200 || window.location.href.indexOf("http")=== -1)) {
        x.innerHTML = pageRequest.responseText;
    } else if (pageRequest.status >= 400) {
        console.log("The request did not complete, an error occurred...");
        x.innerHTML = "An error occurred! Either the resource is not available (404) or the network is unavailable.";
    }
}

// Remove inner HTML content when X close button is clicked
function removeText(containerId) {
    // var x = "" + containerId;
    console.log("containerId to remove: " + containerId);
    document.getElementById(containerId).innerHTML = '';
}

var loadImage = function () {
    var image = document.images[0];
    var downloadingImage = new Image();
    downloadingImage.onload = function(){
        image.src = this.src;
    };
    downloadingImage.src = "resources/images/arco_logo_s.jpg";
};


/* 
* Tabs
* Ajax Tabs Content script v2.0- © Dynamic Drive DHTML code library (http://www.dynamicdrive.com)
* Updated Oct 21st, 07 to version 2.0. Contains numerous improvements
* Modified by: Boris S for Ajax Project purposes
*/
var myTabs={};
myTabs.bustcachevar=1 ; //bust potential caching of external pages after initial request? (1=yes, 0=no)
myTabs.loadstatustext="<img src='resources/images/loading.gif' /> Requesting content...";

function tabs(tabInterfaceId, contentDivId) {
    this.tabInterfaceId=tabInterfaceId; //ID of Tab Menu main container
    this.tabs=document.getElementById(tabInterfaceId).getElementsByTagName("a"); //Get all tab links within container
    this.enabletabpersistence=true;
    this.hottabspositions=[];//Array to store position of tabs that have a "rel" attr defined, relative to all tab links, within container
    this.currentTabIndex=0; //Index of currently selected hot tab (tab with sub content) within hottabspositions[] array
    this.contentDivId=contentDivId;
    this.defaultHTML="";
    this.defaultIframe='<iframe src="about:blank" marginwidth="0" marginheight="0" frameborder="0" vspace="0" hspace="0" ' +
        'class="tabcontentiframe" style="width:100%; min-height: 600px"></iframe>';
    this.defaultIframe=this.defaultIframe.replace(/<iframe/i, '<iframe name="'+"_tabsiframe-"+contentDivId+'" ');
    this.revcontentids=[]; //Array to store ids of arbitrary contents to expand/contact as well ("rev" attr values)
    this.selectedClassTarget="link" //keyword to indicate which target element to assign "selected" CSS class ("linkparent" or "link")
}

tabs.connect = function(pageurl, tabinstance) {
    var pageRequest = false;
    var bustcacheparameter="";

    if (window.XMLHttpRequest)
        pageRequest = new XMLHttpRequest();
    else if (window.ActiveXObject){
        try {
            pageRequest = new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch (e){
            try{
                pageRequest = new ActiveXObject("Microsoft.XMLHTTP");
            }
            catch (e){}
        }
    }
    else
        return false;

    var ajaxfriendlyurl=pageurl.replace(/^http:\/\/[^\/]+\//i, "http://"+window.location.hostname+"/");
    pageRequest.onreadystatechange = function() {
        tabs.loadPage(pageRequest, pageurl, tabinstance)
    };

    //if bust caching of external page
    if (myTabs.bustcachevar) {
        bustcacheparameter = (ajaxfriendlyurl.indexOf("?") != -1) ? "&" + new Date().getTime() : "?" + new Date().getTime();
    }
    pageRequest.open('GET', ajaxfriendlyurl+bustcacheparameter, true);
    pageRequest.send(null)
};

tabs.loadPage=function(pageRequest, pageurl, tabinstance){
    var divId=tabinstance.contentDivId;
    document.getElementById(divId).innerHTML=myTabs.loadstatustext; //Display "fetching page message"

    var x = document.getElementById(divId);
    if (pageRequest.readyState === 4 && (pageRequest.status === 200 || window.location.href.indexOf("http") === -1)){
        x.innerHTML=pageRequest.responseText;
        tabs.ajaxPageLoadAction(pageurl, tabinstance);
    } else if (pageRequest.status >= 400){
        console.log("The request did not complete, an error occurred...");
        x.innerHTML = "An error occurred! Either the resource is not available (404) or the network is unavailable.";
    }
};

tabs.getCookie=function(Name){
    //construct RE to search for target name/value pair
    var re=new RegExp(Name+"=[^;]+", "i");
    if (document.cookie.match(re)) //if cookie found
        return document.cookie.match(re)[0].split("=")[1]; //return its value
    return ""
};

tabs.setCookie=function(name, value){
    document.cookie = name+"="+value+";path=/"; //cookie value is domain wide (path=/)
};

tabs.prototype={

    //PUBLIC function to move foward or backwards through each hot tab (tabinstance.cycleIt('foward/back') )
    cycleIt:function(dir){ 
        if (dir === "next"){
            var currentTabIndex = (this.currentTabIndex<this.hottabspositions.length-1)? this.currentTabIndex+1 : 0;
        }
        else if (dir === "prev"){
            var currentTabIndex = (this.currentTabIndex>0)? this.currentTabIndex-1 : this.hottabspositions.length-1;
        }
        
        this.expandTab(this.tabs[this.hottabspositions[currentTabIndex]]);
    },

    setPersist:function(bool){ //PUBLIC function to toggle persistence feature
        this.enabletabpersistence=bool;
    },

    setSelectedClassTarget:function(objstr){ //PUBLIC function to set which target element to assign "selected" CSS class ("linkparent" or "link")
        this.selectedClassTarget=objstr || "link"
    },

    getSelectedClassTarget:function(tabref){ //Returns target element to assign "selected" CSS class to
        return (this.selectedClassTarget===("linkparent".toLowerCase()))? tabref.parentNode : tabref;
    },

    urlParamSelect:function(tabInterfaceId){
        var result=window.location.search.match(new RegExp(tabInterfaceId+"=(\\d+)", "i")); //check for "?tabInterfaceId=2" in URL
        return (result===null)? null : parseInt(RegExp.$1); //returns null or index, where index (int) is the selected tab's index
    },

    expandTab:function(tabref) {
        var relAttrVal=tabref.getAttribute("rel");
        //Get "rev" attr as a string of IDs in the format ",john,george,trey,etc," to easy searching through
        var associatedRevIds=(tabref.getAttribute("rev"))? ","+tabref.getAttribute("rev").replace(/\s+/, "")+"," : "";
        if (relAttrVal === "#default")
            document.getElementById(this.contentDivId).innerHTML=this.defaultHTML;
        else if (relAttrVal === "#iframe")
            this.iframeDisplay(tabref.getAttribute("href"), this.contentDivId);
        else
            tabs.connect(tabref.getAttribute("href"), this);
        this.expandRevContent(associatedRevIds);
        for (var i=0; i<this.tabs.length; i++){ //Loop through all tabs, and assign only the selected tab the CSS class "selected"
            this.getSelectedClassTarget(this.tabs[i]).className=(this.tabs[i].getAttribute("href") === tabref.getAttribute("href"))? "selected" : ""
        }
        if (this.enabletabpersistence) //if persistence enabled, save selected tab position(int) relative to its peers
            tabs.setCookie(this.tabInterfaceId, tabref.tabposition);
        this.setCurrentTabIndex(tabref.tabposition) //remember position of selected tab within hottabspositions[] array
    },

    iframeDisplay:function(pageurl, contentDivId){
        if (typeof window.frames["_tabsiframe-"+contentDivId] !== "undefined"){
            try{delete window.frames["_tabsiframe-"+contentDivId]} //delete iframe within Tab content container if it exists (due to bug in Firefox)
            catch(err){}
        }
        document.getElementById(contentDivId).innerHTML=this.defaultIframe;
        window.frames["_tabsiframe-"+contentDivId].location.replace(pageurl); //load desired page into iframe
    },

    expandRevContent:function(associatedRevIds){
        var allrevids=this.revcontentids;
        for (var i=0; i<allrevids.length; i++){ //Loop through rev attributes for all tabs in this tab interface
            //if any values stored within associatedRevIds matches one within allrevids, expand that DIV, otherwise, contract it
            document.getElementById(allrevids[i]).style.display=(associatedRevIds.indexOf(","+allrevids[i]+",") !== -1)? "block" : "none"
        }
    },

    //store current position of tab (within hottabspositions[] array)
    setCurrentTabIndex:function(tabposition){ 
        for (var i=0; i<this.hottabspositions.length; i++){
            if (tabposition === this.hottabspositions[i]){
                this.currentTabIndex=i;
                break
            }
        }
    },

    init:function(){
        var persistedtab = tabs.getCookie(this.tabInterfaceId); //get position of persisted tab (applicable if persistence is enabled)
        var selectedtab=-1; //Currently selected tab index (-1 meaning none)
        var selectedtabfromurl=this.urlParamSelect(this.tabInterfaceId); //returns null or index from: tabcontent.htm?tabInterfaceId=index

        this.defaultHTML=document.getElementById(this.contentDivId).innerHTML;
        for (var i=0; i<this.tabs.length; i++){
            this.tabs[i].tabposition=i; //remember position of tab relative to its peers
            if (this.tabs[i].getAttribute("rel")){
                var tabinstance=this;
                this.hottabspositions[this.hottabspositions.length]=i; //store position of "hot" tab ("rel" attr defined) relative to its peers
                this.tabs[i].onclick=function(){
                    tabinstance.expandTab(this);
                    // tabinstance.cancelautoRun(); //stop auto cycling of tabs (if running)
                    return false
                };
                if (this.tabs[i].getAttribute("rev")){ //if "rev" attr defined, store each value within "rev" as an array element
                    this.revcontentids=this.revcontentids.concat(this.tabs[i].getAttribute("rev").split(/\s*,\s*/))
                }
                if (selectedtabfromurl === i || this.enabletabpersistence && selectedtab ===-1 &&
                    parseInt(persistedtab) ===i || !this.enabletabpersistence && selectedtab === -1 &&
                    this.getSelectedClassTarget(this.tabs[i]).className === "selected"){
                    selectedtab=i; //Selected tab index, if found
                }
            }
        } //END for loop

        //if a valid default selected tab index is found
        if (selectedtab !== -1) {
            //expand selected tab (either from URL parameter, persistent feature, or class="selected" class)
            this.expandTab(this.tabs[selectedtab]);
        }
        //else, if no valid default selected index found
        else {
            this.expandTab(this.tabs[this.hottabspositions[0]]); //Just select first tab that contains a "rel" attr
        }

    } //END int() function
} ;//END Prototype assignment



/*
* Pages (for biography)
* Ajax Pagination Script- Author: Dynamic Drive (http://www.dynamicdrive.com)
* Created Sept 14th, 07'
* Modified by Boris S. for Ajax Project purposes
*/

var myPages = {};
myPages.loadstatustext="Requesting content, please wait..."; // HTML to show while requested page is being fetched:
myPages.ajaxbustcache=false; // Bust cache when fetching pages?
myPages.paginatepersist=true; //enable persistence of last viewed pagination link (so reloading page doesn't reset page to 1)?
myPages.pagerange=4; // Limit page links displayed to a specific number (useful if you have many pages in your book)?
myPages.ellipse="..."; // Ellipse text (no HTML allowed)

myPages.connect=function(pageurl, divId){
    var pageRequest = false;
    var bustcacheparameter="";
    if (window.XMLHttpRequest)
        pageRequest = new XMLHttpRequest();
    else if (window.ActiveXObject){
        try {
            pageRequest = new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch (e){
            try{
                pageRequest = new ActiveXObject("Microsoft.XMLHTTP");
            }
            catch (e){}
        }
    }
    else
        return false;
    
    document.getElementById(divId).innerHTML=this.loadstatustext; //Display "fetching page message"
    pageRequest.onreadystatechange=function() {myPages.loadPage(pageRequest, divId)};
    //if bust caching of external page
    if (this.ajaxbustcache) {
        bustcacheparameter = (pageurl.indexOf("?") !== -1) ? "&" + new Date().getTime() : "?" + new Date().getTime();
    }

    //asynchronous request
    pageRequest.open('GET', pageurl+bustcacheparameter, true);
    pageRequest.send(null)
};

myPages.loadPage=function(pageRequest, divId){
    if (pageRequest.readyState === 4 && (pageRequest.status === 200 || window.location.href.indexOf("http") === -1)) {
        document.getElementById(divId).innerHTML=pageRequest.responseText;
    }
};

myPages.getCookie=function(Name){
    var re=new RegExp(Name+"=[^;]+", "i"); //construct RE to search for target name/value pair
    if (document.cookie.match(re)) //if cookie found
        return document.cookie.match(re)[0].split("=")[1]; //return its value
    return null
};

myPages.setCookie=function(name, value){
    document.cookie = name+"="+value
};

myPages.getInitialPage=function(divId, pageinfo){
    // var persistedpage=this.getCookie(divId);
    var selectedpage=(this.paginatepersist && this.getCookie(divId)!=null)? parseInt(this.getCookie(divId)) : pageinfo.selectedpage;
    return (selectedpage>pageinfo.pages.length-1)? 0 : selectedpage //check that selectedpage isn't out of range
};

//MAIN CONSTRUCTOR FUNCTION
myPages.createBook=function(pageinfo, divId, paginateIds){ 
    this.pageinfo=pageinfo; //store object containing URLs of pages to fetch, selected page number etc
    this.divId=divId;
    this.paginateIds=paginateIds ;//array of ids corresponding to the pagination DIVs defined for this pageinstance
    //NOTE: this.paginateInfo stores references to various components of each pagination DIV defined for this pageinstance
    //NOTE: Eg: divs[0] = 1st paginate div, pagelinks[0][0] = 1st page link within 1st paginate DIV, prevlink[0] = previous link within paginate DIV etc
    this.paginateInfo={divs:[], pagelinks:[[]], prevlink:[], nextlink:[], previouspage:null, previousrange:[null,null], leftellipse:[], rightellipse:[]};
    this.dopagerange=false;
    this.pagerangestyle='';
    this.ellipse='<span style="display:none">'+myPages.ellipse+'</span>'; //construct HTML for ellipse
    var initialpage=myPages.getInitialPage(divId, pageinfo);
    this.buildpagination(initialpage);
    this.selectPage(initialpage);
};

myPages.createBook.prototype={

    buildpagination:function(selectedpage){ //build pagination links based on length of this.pageinfo.pages[]
        this.dopagerange=(this.pageinfo.pages.length>myPages.pagerange); //Bool: enable limitPageRange if pagerange value is less than total pages available
        this.pagerangestyle=this.dopagerange? 'style="display:none"' : ''; //if limitPageRange enabled, hide pagination links when building them
        this.paginateInfo.previousrange=null; //Set previousrange[start, finish] to null to start
        if (this.pageinfo.pages.length<=1){ //no 0 or just 1 page
            document.getElementById(this.paginateIds[0]).innerHTML=(this.pageinfo.pages.length==1)? "Page 1 of 1" : "";
            return
        }
        else{ //construct paginate interface
            var paginateHTML='<div class="pages"><ul>\n';
            paginateHTML+='<li><a href="#previous" rel="'+(selectedpage-1)+'"><-</a></li>\n'; //previous link HTML
            for (var i=0; i<this.pageinfo.pages.length; i++){
                var ellipses={left: (i==0? this.ellipse : ''), right: (i==this.pageinfo.pages.length-1? this.ellipse : '')}; //if this is 1st or last page link, add ellipse next to them, hidden by default
                paginateHTML+='<li>'+ellipses.right+'<a href="#page'+(i+1)+'" rel="'+i+'" '+this.pagerangestyle+'>'+(i+1)+'</a>'+ellipses.left+'</li>\n'
            }
            paginateHTML+='<li><a href="#next" rel="'+(selectedpage+1)+'">next -></a></li>\n'; //next link HTML
            paginateHTML+='</ul></div>'
        }// end construction
        
        this.paginateInfo.previouspage=selectedpage; //remember last viewed page
        
        for (var i=0; i<this.paginateIds.length; i++){ //loop through # of pagination DIVs specified
            var paginatediv=document.getElementById(this.paginateIds[i]); //reference pagination DIV
            this.paginateInfo.divs[i]=paginatediv; //store ref to this paginate DIV
            paginatediv.innerHTML=paginateHTML;
            var paginatelinks=paginatediv.getElementsByTagName("a");
            var ellipsespans=paginatediv.getElementsByTagName("span");
            this.paginateInfo.prevlink[i]=paginatelinks[0];
            if (paginatelinks.length>0)
                this.paginateInfo.nextlink[i]=paginatelinks[paginatelinks.length-1];
            this.paginateInfo.leftellipse[i]=ellipsespans[0];
            this.paginateInfo.rightellipse[i]=ellipsespans[1];
            this.paginateInfo.pagelinks[i]=[]; //array to store the page links of pagination DIV
            
            for (var p=1; p<paginatelinks.length-1; p++){
                this.paginateInfo.pagelinks[i][p-1]=paginatelinks[p]
            }
            
            var pageinstance = this;
            
            paginatediv.onclick=function(e){
                var targetobj=window.event? window.event.srcElement : e.target;
                if (targetobj.tagName=="A" && targetobj.getAttribute("rel")!=""){
                    if (!/disabled/i.test(targetobj.className)){ //if this pagination link isn't disabled (CSS classname "disabled")
                        pageinstance.selectPage(parseInt(targetobj.getAttribute("rel")));
                    }
                }
                return false
            }
        }
    },

    selectPage:function(selectedpage) {
        //replace URL's root domain with dynamic root domain (with or without "www"), for ajax security sake:
        if (this.pageinfo.pages.length>0){
            var ajaxfriendlyurl=this.pageinfo.pages[selectedpage].replace(/^http:\/\/[^\/]+\//i, "http://"+window.location.hostname+"/");
            myPages.connect(ajaxfriendlyurl, this.divId) //fetch requested page and display it inside DIV
        }
        
        if (this.pageinfo.pages.length<=1) //if this book only contains only 1 page (or 0)
            return; //stop here
        var paginateInfo=this.paginateInfo;
        
        for (var i=0; i<paginateInfo.divs.length; i++){ //loop through # of pagination DIVs specified
            //var paginatediv=document.getElementById(this.paginateIds[i])
            paginateInfo.prevlink[i].className=(selectedpage === 0)? "prevnext disabled" : "prevnext"; //if current page is 1st page, disable "prev" button
            paginateInfo.prevlink[i].setAttribute("rel", selectedpage-1); //update rel attr of "prev" button with page # to go to when clicked on
            paginateInfo.nextlink[i].className=(selectedpage === this.pageinfo.pages.length-1)? "prevnext disabled" : "prevnext";
            paginateInfo.nextlink[i].setAttribute("rel", selectedpage+1);
            paginateInfo.pagelinks[i][paginateInfo.previouspage].className=""; //deselect last clicked on pagination link (previous)
            paginateInfo.pagelinks[i][selectedpage].className="currentpage" //select current pagination link
        }
        paginateInfo.previouspage=selectedpage; //Update last viewed page info
        myPages.setCookie(this.divId, selectedpage);
        this.limitPageRange(selectedpage) //limit range of page links displayed (if applicable)
    },

    limitPageRange:function(selectedpage) {
        //reminder: selectedpage count starts at 0 (0=1st page)
        var paginateInfo=this.paginateInfo;
        if (this.dopagerange){
            var visiblelinks=myPages.pagerange-1; //# of visible page links other than currently selected link
            var visibleleftlinks=Math.floor(visiblelinks/2); //calculate # of visible links to the left of the selected page
            var visiblerightlinks=visibleleftlinks+(visiblelinks%2==1? 1 : 0); //calculate # of visible links to the right of the selected page
            if (selectedpage<visibleleftlinks){ //if not enough room to the left to accomodate all visible left links
                var overage=visibleleftlinks-selectedpage;
                visibleleftlinks-=overage; //remove overage links from visible left links
                visiblerightlinks+=overage //add overage links to the visible right links
            }
            else if ((this.pageinfo.pages.length-selectedpage-1)<visiblerightlinks){ //else if not enough room to the left to accomodate all visible right links
                var overage=visiblerightlinks-(this.pageinfo.pages.length-selectedpage-1);
                visiblerightlinks-=overage; //remove overage links from visible right links
                visibleleftlinks+=overage //add overage links to the visible left links
            }
            var currentrange=[selectedpage-visibleleftlinks, selectedpage+visiblerightlinks]; //calculate indices of visible pages to show: [startindex, endindex]
            var previousrange=paginateInfo.previousrange; //retrieve previous page range
            for (var i=0; i<paginateInfo.divs.length; i++){ //loop through paginate divs
                var p = '';
                if (previousrange){ //if previous range is available (not null)
                    for (p = previousrange[0]; p<=previousrange[1]; p++){ //hide all page links
                        paginateInfo.pagelinks[i][p].style.display="none"
                    }
                }

                for (p=currentrange[0]; p<=currentrange[1]; p++){ //reveal all active page links
                    paginateInfo.pagelinks[i][p].style.display="inline"
                }

                //always show 1st page link
                paginateInfo.pagelinks[i][0].style.display="inline";
                //always show last page link
                paginateInfo.pagelinks[i][this.pageinfo.pages.length-1].style.display="inline";
                //if starting page is page3 or higher, show ellipse to page1
                paginateInfo.leftellipse[i].style.display=(currentrange[0]>1)? "inline" : "none";
                //if end page is 2 pages before last page or less, show ellipse to last page
                paginateInfo.rightellipse[i].style.display=(currentrange[1]<this.pageinfo.pages.length-2)? "inline" : "none"
            }
        }
        paginateInfo.previousrange=currentrange
    },

    refresh:function(pageinfo){
        this.pageinfo=pageinfo;
        var initialpage=myPages.getInitialPage(this.divId, pageinfo);
        this.buildpagination(initialpage);
        this.selectPage(initialpage);
    }
};

// helper function to prevent nested tabs not loading properly
function loadNested () {
    console.log("Test");
    location.reload();
}