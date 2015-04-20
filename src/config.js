//- 统计代码的配置信息 -/
//- 只有gather_param中定义的项，才会被传递到最终url中 -/
var config = {
    // The analytic server host name.
    host_name:'',
    // The analytic server host name list.
    permit_domain:['tongji.leju.com','tongji.dev.leju.com'],
    // Parameters used in page tracking.
    gather_param:{'uid':'','uuid':'', 'host':'', 'url':'', 'referer_url':'', 'screen_height':'', 'screen_width':'', 'brower':'',
                  'user_agent':'','city':'','source':'','os':'','spider_type':'',
                  'level1_page':'','level2_page':'','custom_id':'','webtype':'','is_register':''},
    // Parameters used in event tracking.
    gather_event_param:{'event':'','event_name':'','city':'','weixin_house_id':'','level1_page':'','level2_page':'','source':'',
    					'param1':'','param2':'','param3':'','param4':'','webtype':''},
    init:function() {
        // Set current analytic server host name, defaults to tongji.leju.com
        if(config.host_name == '') {
            config.host_name = document.location.host;
        }
        if( ! config.permit_domain.contains(config.host_name))
        {
            config.host_name = 'tongji.leju.com';
        }
    }
};
