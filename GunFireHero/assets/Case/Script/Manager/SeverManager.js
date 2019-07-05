
var UserInfo = require("UserInfo");

var SeverManager =  cc.Class({

    extends: require("BaseManager"),

    properties: {
        
    },  

    onLoad () 
    {
        this.Domain = GameConfig.Domain;
        this.UserInfo = new UserInfo(); //用户信息
        if (!CC_WECHATGAME)
            return;
        var self = this;
        var Init = cc.find("Canvas").getComponent("GameInit")
        var Data = Init.Data;
        var infodata = Init.UserData;
        if(Data)
        {
            this.UserInfo.openid = Data.openid,
            this.UserInfo.id = Data.id;
            this.UserInfo.nickName = Data.nick_name;
            this.UserInfo.avatar_url = Data.avatar_url;
            this.UserInfo.BestScore = Data.score;
            if(Data.nick_name == null||Data.nick_name == "null")
            {
                //授权
                self.Authorization();
            }
            
            self.UserInfo.is_status = infodata.is_status;
            self.UserInfo.Coin = Number(infodata.gold);
            self.UserInfo.Score = infodata.score;

            this.C2G_AppID(true);
        }
        else
        {
            console.error("获取不到服务器数据！！！！！！！！！！");
        }

        var obj = wx.getLaunchOptionsSync();
        var Sence = obj.query.scene == undefined ? null : obj.query.scene;
        this._Sence = decodeURIComponent(Sence); //渠道过来的场景值
        this._AppID = obj.referrerInfo&&obj.referrerInfo.appId?obj.referrerInfo:"";
        this.gameID = 0;//当局游戏ID
    },  

    //授权
    Authorization()
    {
        let width = this.UserInfo.screenWidth;
        let height = this.UserInfo.screenHeight;
        var ipx = this.UserInfo.ipx;

        var RankLogo_Y =  GameConfig.AuthorPos.X; //y坐标
        var RankLogo_X =  GameConfig.AuthorPos.Y; //x坐标
        var RankLogo_Width = GameConfig.AuthorPos.W; //宽
        var RankLogo_Height = GameConfig.AuthorPos.H; //高 

        var _top = (height * ipx/2 + RankLogo_Y - RankLogo_Width/2)/ipx; //553 y，48 宽除以2
        var _left = (width * ipx/2 + RankLogo_X - RankLogo_Width/2)/ipx; //216.2 x

        let button = wx.createUserInfoButton({
            type: 'text',
            text: '',
            style: {
                left: _left,
                top: _top,
                width: RankLogo_Width/ipx,
                height: RankLogo_Height/ipx,
                textAlign: 'center'
            }
        });

        this.button = button;
        var self = this;
        button.onTap((res) => {
            if(res.userInfo)
            {
                var Data = res.userInfo;
                self.UserInfo.nickName = Data.nickName;
                self.UserInfo.avatar_url = Data.avatarUrl;
                self.UserInfo.gender = Data.gender;
                button.destroy();
                self.button = null;

                wx.login({
                    success (res) {
                        if (res.code) {
                            self.UserInfo.code = res.code
                        }
                        wx.request({
                            url: self.Domain + 'act=userinfo',
                            data: {
                                code: self.UserInfo.code,
                                nickName:self.UserInfo.nickName,
                                avatarUrl: self.UserInfo.avatar_url,
                                gender:self.UserInfo.gender,
                                scene:self._Sence,
                                uid:0,
                                version:self.UserInfo.version,
                            },
                        });
                    }
                    });
            }
        })
    },

    
    ShowHideButton(active)
    {
        if(this.button != null && this.button!=undefined)
        {
            if(active)
            {
                this.button.show();
            }
            else
            {
                this.button.hide();
            }
        }
    },

   

    C2G_AppID(active)
    {
        if(!active)
            return;
        var self =this; 
        wx.request({ 
            url:  self.Domain + "act=gamelist",
            data:
            {
                openid: self.UserInfo.openid,
                version:self.UserInfo.version
            },
            success (res) 
            {
                var data = res.data.data;
                
                self.UserInfo.AppIDInfoList = data.gamelist;
                
                GameGlobal.UIManager.ShowApp("BtnAppList");
            }
        })
    },

    //游戏开始
    C2G_GameStart()
    {
        if (!CC_WECHATGAME)
            return;
        var self =this; 
        wx.request({
            url:  this.Domain + "act=index",
            data:
            {
                openid: self.UserInfo.openid,
                version: self.UserInfo.version
            },
            success (res) {
                var data = res.data.data;
                self.gameID = data.id;
            }
          })
    },

    C2G_GameOver(level)
    {
        if (!CC_WECHATGAME)
            return;
        var self =this; 
        wx.request({
            url:  this.Domain + "act=end",
            data:
            {
                openid: self.UserInfo.openid,
                version: self.UserInfo.version,
                level: level
            },
            success (res) {
               
            }
          })
    },
    
    /*
    //C2G游戏结束
    C2G_GameOver(Score,level,Coin)
    {
        if (!CC_WECHATGAME)
            return;
        var self = this;
        var gunlistJosn = this.UserInfo.GunListToJson();
        wx.request({
            url:  this.Domain + "act=end&openid=" + self.UserInfo.openid + "&score="+Score+"&id="+self.gameID+"&gold="+Coin+"&version="+self.UserInfo.version +"&level="
            +level,
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            data:
            {
                details:gunlistJosn
            },
            
            success (res)
            {
                
            }
          });
        //向子域提交信息
        GameGlobal.SubManager.SubScore(Score);
    },
*/

    C2G_Rank(action)
    {
        if(!CC_WECHATGAME)
            return;
        wx.request({
            url: this.Domain + 'act=paihang',
            data:
            {
                openid:this.UserInfo.openid,
                version:this.UserInfo.version,
            },
            success (res) {
                action(res);
            }
        });
    },
    
    //跳转其他游戏
    AssociatedProgramEvent(AppID,url,ID)
    {
        var self = this;
        wx.navigateToMiniProgram({
            appId: AppID,
            path: url,
            envVersion: 'release',
            success(res) {
                wx.request({
                    url: self.Domain +"act=cgame",
                    data: {
                      openid: self.UserInfo.openid,
                      version: self.UserInfo.version,
                      id: ID,
                      appid:AppID
                    },
                  });
            }
          })
        wx.request({
            url:this.Domain +'act=game',
            data:
            {
                openid:self.UserInfo.openid,
                version:self.UserInfo.version,
                id:ID,
            },
        });
    }, 

   
    C2G_hzlist()
    {
        if(!CC_WECHATGAME)
            return;
        var self = this;
        wx.request({
            url: this.Domain + 'act=hzlist',
            data:
            {
                openid:this.UserInfo.openid,
                version:this.UserInfo.version,
            },
            success (res) {
                self.UserInfo.hzlist = res.data.data;
                GameGlobal.UIManager.ShowApp(Constant.UIPop.UIAppBox,(node)=>
                {
                    //node.getComponent("UIAppBox").ShowBox(res.data.data);
                    //node.active = false;
                    self.UIAppBox = node;
                });
            }
        });
    },
    
    
});
