//- 统计代码主体，定义各种信息获取方法 -/
var gather = {
    // Current document URL.
    url:'',
    // Document
    d:document,
    // Query string used in page tracking.
    url_param:'',
    /* 记录是否已经增加utm_param_res=link */
    /* Not in use */
    utmMark:0,
    // Is develop mode ?
    isDevelop:false, //是否开发环境
    // DOM Elements that could be track when click .
    event_item:['a','button','body'], // 可能被事件跟踪的
    init:function() {
        this.isDevelop = this._checkDevelop();
        if(this.isDevelop || !this._checkIsGatherDefined() || !this._checkIsGatherAbled()){
            //return;
        }
        this.url='http://' + config.host_name + '/?site=gather&ctl=gather&act=game_general&';
        this.url_param=this.get_param();
        var img = new Image();
        img.onload = null;
        img.src = gather.url+gather.url_param;
        img.style.display="none";
    },
    event:function(){
    	var event_item = this.event_item;
    	for(var i=0; i< event_item.length;i++)
    	{
    		this._fetchevent_item(event_item[i]);
    	}
    },
    // 立即触发请求
    event_now:function(obj){

        var self = this;
    	var obj =  obj.getAttribute("gather");
			var obj = eval("("+obj+")");
			var param={};
			param.event = obj.event || '';
			param.event_name = obj.event_name || '';
			param.city = obj.city || '';
			param.level1_page = obj.level1_page || '';
			param.level2_page = obj.level2_page || '';
            param.source = GetCookie('source_name') || '';
			param.param1 = obj.param1 || '';
			param.param2 = obj.param2 || '';
			param.param3 = obj.param3 || '';
			param.param4 = obj.param4 || '';
			param.webtype = obj.webtype || self._getWebtype();
			if(param.event == '')
			{
				return false;
			}
			//处理完
	        var p=[];
	        var url_param = '';
	        for(var k in config.gather_event_param){
	            if(typeof(config.gather_event_param[k])!="undefined" && param[k] != ""){
	                p.push(k+"="+encodeURIComponent(param[k]));
	            }
	        }
	        url_param = p.join("&");
	        var img = new Image();
		    img.onload = null;
		    img.src = 'http://' + config.host_name + '/?site=gather&ctl=gather&act=event&' + url_param;
		    img.style.display="none";
    },
    _fetchevent_item:function(item){
        // 增加 body上的统计 by tiantian 2014/9/11
        if(item === "body"){
            if( document.body.getAttribute("gather_new") ){
                document.body.onload = function(){b_new(document.body)};
                return;
            }
        }
    	var tags = document.getElementsByTagName(item);
    	var l = tags.length;
        var self = this;
    	for(var i=0; i<l; i++)
    	{
    		var tag = tags[i];
                var isNew = tag.getAttribute("gather_new") ? true : false;
			var tongji = tag.getAttribute("gather") || tag.getAttribute("gather_new");
			if(!tongji && typeof tongji != "undefined" && tongji != 0)
			{
				continue;
			}
			addEvent(tag, isNew);
    	}
    	function addEvent(obj, isNew) //增加 新的统计 by tiantian 2014/9/11
	    {
	    	obj.attachEvent ? obj.attachEvent('onclick',isNew ? function(){b_new(obj)} : function(){b(obj)}) :
	    	obj.addEventListener('click',isNew ? function(){b_new(obj)} : function(){b(obj)});
	    };
    	function b(tag)
    	{
    		var obj =  tag.getAttribute("gather");
			var obj = eval("("+obj+")");
			var param={};
			param.event = obj.event || '';
			param.event_name = obj.event_name || '';
			param.city = obj.city || '';
			param.level1_page = obj.level1_page || '';
			param.level2_page = obj.level2_page || '';
            param.source = GetCookie('source_name') || '';
			param.param1 = obj.param1 || '';
			param.param2 = obj.param2 || '';
			param.param3 = obj.param3 || '';
			param.param4 = obj.param4 || '';
			param.webtype = obj.webtype || self._getWebtype();
			if(param.event == '')
			{
				return false;
			}
			//处理完
	        var p=[];
	        var url_param = '';
	        for(var k in config.gather_event_param){
	            if(typeof(config.gather_event_param[k])!="undefined" && param[k] != ""){
	                p.push(k+"="+encodeURIComponent(param[k]));
	            }
	        }
	        url_param = p.join("&");
	        var img = new Image();
		    img.onload = null;
		    img.src = 'http://' + config.host_name + '/?site=gather&ctl=gather&act=event&' + url_param;
		    img.style.display="none";
	    };
    	function b_new(tag)
    	{
    		var obj =  tag.getAttribute("gather_new");
			var obj = eval("("+obj+")");
			var param={};
			param.act = obj.act || '';
			param.a_id = obj.a_id || '';
            param.event_name = obj.event_name || '';
			param.event = obj.event || '';
            param.level1_page = obj.level1_page || '';
            param.level2_page = obj.level2_page || '';
			param.city = obj.city || '';
            param.weixin_house_id = obj.weixin_house_id || '';
			param.uid = obj.uid || '';
			param.param1 = obj.param1 || '';
			param.param2 = obj.param2 || '';
			param.param3 = obj.param3 || '';
			param.param4 = obj.param4 || '';
			if(param.event == '')
			{
				return false;
			}
			//处理完
	        var p=[];
	        var url_param = '';
	        for(var k in config.gather_event_param){
	            if(typeof(config.gather_event_param[k])!="undefined" && param[k] != ""){
	                p.push(k+"="+encodeURIComponent(param[k]));
	            }
	        }
	        url_param = p.join("&");
	        var img = new Image();
		    img.onload = null;
		    img.src = 'http://' + config.host_name + '/?site=gather&ctl=gather&act='+param.act+'&' + url_param;
		    img.style.display="none";
	    };
    },
    get_param:function() {
        /*
        *读config.gather_param赋值
        *只传递config中定义的项
        */
        var self=this;
        var param={};
        param.uid=self._getUid();
        param.host=self._getDomain();
        param.url=self._getCurUrl();
        param.referer_url=self._getReferer();
        var s=self._getScreen();
        param.screen_height=s[0];
        param.screen_width=s[1];
        param.brower=self._getBrowser();
        param.user_agent=self._getUseragent();
        param.city=self._getCity();
        param.os=self._getOs();
        //param.lon=self._getLon();
        //param.lat=self._getLat();
        param.location_city=self._getLocationcity();
        param.level1_page=self._getLevel1page();
        param.level2_page=self._getLevel2page();
        param.custom_id=self._getCustom_id();
        param.spider_type=self._getSpider();
        param.source=self._getSource();
        param.webtype=self._getWebtype();
        param.is_register=self._getIsRegister();
        param.uuid = GetCookie('uuid') || '';
        //处理完
        var p=[];
        for(var k in config.gather_param){
            if(typeof(config.gather_param[k])!="undefined" && param[k] != ""){
                p.push(k+"="+encodeURIComponent(param[k]));
            }
        }
        return p.join("&");
    },
    /*
    *各种获取
    */
    _getDebugIp:function(){
        var self=this;
        var debugIp=self.querySt("debug_ip");
        if(typeof(debugIp)=="string" && debugIp.length>0){
            return debugIp;
        }else{
            return false;
        }
    },
    querySt:function(ji) {
        hu = window.location.search.substring(1);
        gy = hu.split("&");
        for (i=0;i<gy.length;i++) {
            ft = gy[i].split("=");
            if (ft[0] == ji) {
                return ft[1];
            }
        }
        return '';
    },
    _getUid:function(){
        if ( typeof(uid)!= "undefined" ){
            return trim(uid);
        }
        return "";
    },
    _getLon:function(){
        if ( typeof(lon)!= "undefined" ){
            return trim(lon);
        }
        return "";
    },
    _getLat:function(){
        if ( typeof(lat)!= "undefined" ){
            return trim(lat);
        }
        return "";
    },
    _getDomain:function(){
        return this.d.domain;
    },
    _getCurUrl:function(){
        return this.d.location.href;
    },
    _getReferer:function(){
        return this.d.referrer;
    },
    _getCity:function(){
        if ( typeof(city)!= "undefined" ){
            return trim(city);
        }
        return "";
    },
    _getLevel1page:function(){
        if ( typeof(level1_page)!= "undefined" ){
            return trim(level1_page);
        }
        return "";
    },
    _getLevel2page:function(){
        if ( typeof(level2_page)!= "undefined" ){
            return trim(level2_page);
        }
        return "";
    },
    _getCustom_id:function(){
    	if ( typeof(custom_id)!= "undefined" ){
            return trim(custom_id);
        }
        return "";
    },
    _getScreen:function(){
        return [screen.height,screen.width];
    },
    _getBrowser:function(){
        var useragent=navigator.userAgent;
        if(useragent.indexOf('Chrome') > 0)
        {
        	return 'Chrome'
        }else if(useragent.indexOf('MSIE') > 0)
        {
        	return 'IE';
        }else if(useragent.indexOf('Firefox') > 0)
        {
        	return 'Firefox';
        }else if(useragent.indexOf('Opera') > 0)
        {
        	return 'Opera';
        }else if(useragent.indexOf('Safari') > 0 && useragent.indexOf('Mac') > 0)
        {
        	return 'Safari';
        }else if(useragent.indexOf('360SE') > 0)
        {
        	return '360SE';
        }else if(useragent.indexOf('MetaSr') > 0)
        {
        	return 'sogou';
        }else if(useragent.indexOf('Nexus') > 0)
        {
        	return 'android';
        }else if(useragent.indexOf('MQQ') > 0)
        {
        	return 'qq';
        }else if(useragent.indexOf('UCWEB') > 0 || useragent.indexOf('UCBrowser') > 0)
        {
        	return 'UCWEB';
        }else if(useragent.indexOf('baiduboxapp') > 0)
        {
        	return 'baidu';
    	}else
        {
        	return 'other';
        }

    },
    _getUseragent:function(){
        var useragent=navigator.userAgent;
        return useragent;
    },
    _getSource:function(){
    	var source = this.querySt("source");
    	return source;
    },
    _getIsRegister:function(){
    	var mid = GetCookie('mid');
    	if(mid){
    		return '1';
    	}else{
    		return '0';
    	}
    	return source;
    },
    _getWebtype:function(){
    	var url = this.d.location.href;
    	if(url.indexOf('/wap/') > 0 || url.indexOf('site=wap') > 0)
    	{
    		return 'wap';
    	}
    	if(url.indexOf('/weixin/') > 0 || url.indexOf('site=weixin') > 0)
    	{
    		return 'weixin';
    	}
    	if(url.indexOf('/pay/') > 0)
    	{
    		return 'weixin';
    	}
    	if(url.indexOf('/weibo/') > 0 || url.indexOf('site=weibo') > 0)
    	{
    		return 'weibo';
    	}
		if(url.indexOf('shihui') > 0)
    	{
    		return 'shihui';
    	}
    	return 'weixin';
    },
    _getLocationcity:function(){
    	if ( typeof(location_city)!= "undefined" ){
            return trim(location_city);
        }
        return "";
    },
    _getOs:function(){
        var useragent=navigator.userAgent;
        if(useragent.indexOf('Mac OS') > 0)
        {
        	return 'iOS'
        }else if(useragent.indexOf('Android') > 0)
        {
        	return 'Android';
        }else if(useragent.indexOf('SymbianOS') > 0)
        {
        	return 'SymbianOS';
        }else if(useragent.indexOf('Windows Phone') > 0)
        {
        	return 'WPhone';
        }else if(useragent.indexOf('Windows NT') > 0)
        {
        	return 'windows';
        }else
        {
        	return 'other';
        }
    },
    _getSpider:function()
    {
    	 var useragent=navigator.userAgent.toLowerCase();
    	 if(useragent.indexOf('spider') > 0 || useragent.indexOf('bot') > 0)
    	 {
    	 	if(useragent.indexOf('baidu') > 0)
    	 	{
    	 		return 'Baidu';
    	 	}else if(useragent.indexOf('sogou') > 0)
    	 	{
    	 		return 'Sogou';
    	 	}else if(useragent.indexOf('google') > 0)
    	 	{
    	 		return 'Google';
    	 	}else
    	 	{
    	 		return 'other';
    	 	}
    	 }else
    	 {
    	 	return '';
    	 }
    },
    _checkDevelop:function(){//判断是否处于开发环境
        var domain = document.location.host;
        if(domain.match(/\.dev\.|\.bch\.|^zzs\./)){
            return true;
        }
        return false;
    },
    _checkIsGatherDefined:function(){//判断是否引用过gather.js
        if( typeof(window.isGatherDefined) == "undefined" ){
            return true;
        }else{
            window.isGatherDefined = true;
            return false;
        }
    },
    _checkIsGatherAbled:function(){//判断是否立即执行
        if( typeof(isGatherAbled) === "undefined" ){
            return true;
        }
        return isGatherAbled;
    }
};