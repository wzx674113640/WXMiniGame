
var userInfo =  cc.Class({
 
    properties: {
        Coin : 0,//金币
        BestScore: 0,//最高分
       
        screenWidth:0,
        screenHeight:667,
        ipx:0,

        openid:0,
        id:0,
        nickName: null, //昵称
        avatar_url: null,//头像
        code: null,
        gender:null, //性别
        
        version:100, //版本号
        is_status:1,//审核状态  默认非审核状态
        views:null,// 进入游戏后跳转其他游戏的页面 数据
        AppIDInfoList:[],// 导出游戏的图标数据
        hzlist: null
    },

    ctor()
    {
        this.getSystemInfo();
        this.version = GameConfig.version;
    },

    getSystemInfo()
    {
        if(!CC_WECHATGAME)
            return;
        var sysInfo = window.wx.getSystemInfoSync();
        this.MeansButtonInfo = wx.getMenuButtonBoundingClientRect();
       
        this.sysInfo = sysInfo;
        this.screenWidth = sysInfo.screenWidth;
        this.screenHeight = sysInfo.screenHeight;
        this.ipx = 750/this.screenWidth;
        this.MeansY = (this.screenHeight/2 - this.MeansButtonInfo.top - this.MeansButtonInfo.height/2) * this.ipx;
        this.StartPos  = -(this.screenHeight * this.ipx)/2 + 150; //套路UI初始位置
        this.GameClub = wx.createGameClubButton({
            icon: "light",
            style:{
                left:20,
                top:100,
                width:40,
                height:40
            }
        })
    },
});
