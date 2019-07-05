
var SharePIC = [
    "https://img.qkxz.com/cj/share/110.jpg",
    "https://img.qkxz.com/cj/share/120.png",
    "https://img.qkxz.com/cj/share/130.png",
    "https://img.qkxz.com/cj/share/140.png",
]

var ShareStr = [
    "火爆朋友圈的小游戏，大家都在消灭恶魔！",
    "火爆朋友圈的小游戏，大家都在抢着玩。",
    "最好玩的解压小游戏来袭，超过百万人下班在玩。",
    "百万恶魔兽来袭，赶紧来消灭他们吧。"

];

var AdsManager =  cc.Class({
    extends: require("BaseManager"),

    onLoad()
    {
        this.videoAdID = 'adunit-6bfd143b44d27ac9';
        this.bannerAdID = 'adunit-5009e34d3f7474d9';

        this.bottomPos = 0;//"不了谢谢"适配像素高度
        this.bannerAdHeight = 117; // 广告高度
        this.ipx = GameGlobal.SeverManager.UserInfo.ipx;
        this.screenHeight = GameGlobal.SeverManager.UserInfo.screenHeight;
        this.screenWidth =  GameGlobal.SeverManager.UserInfo.screenWidth;
        let sysInfo = GameGlobal.SeverManager.UserInfo.sysInfo;
        this.StartBannerPos = -300;
        this.BannerCount = GameConfig.BannerCount;

        if(!CC_WECHATGAME)
            return;
        this.IsIPhoneX =  sysInfo.model.indexOf('iPhone X') == -1? false:true;
        this.ShareEvent = null; //分享事件
        this.action = null; //看视频事件
        
        this.InitShareEvent();
        this.InitVideoEvent();
        this.ShareHideShow();
        this.ShowOrHideAdervert(false);
    },
   
    //初始化看视频事件
    InitVideoEvent()
    {
        this.videoAd = wx.createRewardedVideoAd({
            adUnitId: this.videoAdID
        });
        var self = this;
        this.videoAd.onError(err => {
            //看视频失败回调
            //....
            GameGlobal.HintManager.HideLoading();
            if(self.action!= null)
            {
                self.action();
                GameGlobal.HelperManager.ReductionVideoCount(GameGlobal.HelperManager.GetAllVideoCount());
                self.action == null;
            }
        })
        //this.VideoClose();
    },

    //初始化右上角分享事件
    InitShareEvent() 
    {
        var value = Math.floor(Math.random()*ShareStr.length);
        this.ShareImg = SharePIC[value];
        this.ShareString = ShareStr[value];
        var actionImg = ()=>
        {
            var value = Math.floor(Math.random()*SharePIC.length);
            this.ShareImg = SharePIC[value];
            return this.ShareImg;
        }

        var actionTitle = ()=>
        {
            var value = Math.floor(Math.random()*SharePIC.length);
            this.ShareString = ShareStr[value];
            return this.ShareString;
        }
        var self = this;
        //注册右上角转发事件
        wx.onShareAppMessage(()=>{
            return {
                title: actionTitle(),
                imageUrl: actionImg(),
                success(res){
                  
                },
                fail(res){
                   
                }
            } 
        });
        //显示右上角转发按钮
        wx.showShareMenu({
            withShareTicket: true
        });
    },


    //用离开和进入程序的回调判断分享
    ShareHideShow()
    {
        wx.onHide(()=>
        {
            var timeDate = new Date();
            this.hideTime = timeDate.getTime();
        })
        wx.onShow(()=>
        {
            var timeDate = new Date();
            var showTime = timeDate.getTime();
            var value = showTime - this.hideTime;
            if(value>3000)
            {
                if(this.ShareEvent!= null)
                {
                    //GameGlobal.HintManager.TitlePop("分享成功");
                    /*
                    wx.showToast({
                        title: "分享成功",
                        icon: 'success',
                        duration: 800
                      })
                    */
                    this.ShareEvent();
                    this.ShareEvent = null;
                }
            }
            else if(value<3000)
            {
                if(this.ShareEvent!= null)
                {
                    this.ShareEvent = null;
                    wx.showToast({
                        title: "分享失败！",
                        icon: 'success',
                        duration: 800
                      })
                }
                
                //GameGlobal.HintManager.TitlePop("分享失败，请分享到不同的群");
            }
        })
    },

    //显示或者隐藏Banner 广告 会刷新广告
    ShowOrHideAdervert(Active)
    {
        if(!CC_WECHATGAME)
            return;

        var self = this;
        let bannerAd = wx.createBannerAd({
            adUnitId: self.bannerAdID,
            style: {
                left: 0,
                top:0,
                width:340
            }
            });
        bannerAd.onLoad(() => {
            
            self.bannerAdHeight = bannerAd.style.realHeight;

            if(this.IsIPhoneX)
            {
                bannerAd.style.top = self.screenHeight-bannerAd.style.realHeight - 15;
                self.StartBannerPos = (self.screenHeight/2 - self.bannerAdHeight - 74)*self.ipx * -1;
            }
            else
            {
                bannerAd.style.top = self.screenHeight-bannerAd.style.realHeight;
                self.StartBannerPos = (self.screenHeight/2 - self.bannerAdHeight - 40)*self.ipx * -1;
            }
            
            bannerAd.style.left = (self.screenWidth - bannerAd.style.realWidth )/2;
            
            self.bottomPos = self.bannerAdHeight * self.ipx;
            
            if(Active)
            {
                bannerAd.show();
            }   
            
        });
        
        bannerAd.onError(err => {
            console.error("banner加载失败！" +　err);
        });

        this.bannerAd = bannerAd;
       
    },

    //显示或者隐藏Banner 广告 不刷新
    BannerShow(active)
    {
        if(active)
        {
            if(this.bannerAd == undefined)
            {
                this.ShowOrHideAdervert(true);
            }
            else
            {   
                this.bannerAd.show();
            }
        }
        else
        {
            if(this.bannerAd == undefined)
                return;
            if(this.BannerCount>0)
            {
                this.bannerAd.hide();
                this.BannerCount--;
            }
            else
            {
                this.bannerAd.destroy();
                this.ShowOrHideAdervert(false);
                this.BannerCount = GameConfig.BannerCount;
            }
        }
    },

    //看视频
    SeeVideoEvent(action,str = null,failAction = null)
    {
        if(!CC_WECHATGAME)
            return;
        this.Count = GameGlobal.HelperManager.GetAllVideoCount();
        if(this.Count <= 0)
        {
            this.AddShareEvent(action);
            return;
        }
        //显示遮罩
        //GameGlobal.HintManager.ShowLoading();
        this.videoAd.offClose();
        this.action = action;
        this.failAction = failAction;
        this.str = str;
        this.videoAd.load().then(() => 
        {
            //GameGlobal.HintManager.HideLoading();
        });
        this.videoAd.show().then(()=>
        {
            //GameGlobal.HintManager.HideLoading();
        });
        var self = this;
        this.videoAd.onClose(res => {
            self.videoAd.offClose();
            if (res && res.isEnded || res === undefined) {
                if(self.str != null)
                {
                    wx.showToast({
                        title: self.str,
                        icon: 'success',
                        duration: 800
                    })
                }
                self.AddCount("VideoAirCount");
                 if(self.action!= null)
                {
                    self.action();
                    self.action = null;
                    self.failAction = null;
                }
                GameGlobal.HelperManager.ReductionVideoCount(this.Count);
            } 
            else {
                if(self.failAction!= null)
                {
                    self.failAction();
                    self.failAction = null;
                    self.action = null;
                }
            }
            self.isSeeVideo = false;
        })
    },

    AddCount(str)
    {
        var valueCount = cc.sys.localStorage.getItem(str)
        if(valueCount)
        {
            valueCount ++;
            cc.sys.localStorage.setItem(str,valueCount);
        }
        else
        {
            cc.sys.localStorage.setItem(str,1);
        }
    },

    //注册分享事件
    AddShareEvent(action)
    {
        var self = this;
        var actionImg= ()=>
        {
            var value = Math.floor(Math.random()*SharePIC.length);
            this.ShareImg = SharePIC[value];
            return this.ShareImg;
        }

        var actionTitle = ()=>
        {
            var value = Math.floor(Math.random()*SharePIC.length);
            this.ShareString = ShareStr[value];
            return this.ShareString;
        }
        
        wx.shareAppMessage({
            title: actionTitle(),
            imageUrl: actionImg(),
        });
        this.ShareEvent = ()=>
        {
            self.AddCount("ShareAirCount");
            action();
        } 
    },
});
