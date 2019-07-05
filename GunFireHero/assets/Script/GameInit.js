var GameConfig1 = require("GameConfig");
cc.Class({
    extends: cc.Component,

    properties: {
        ProgressBar:cc.ProgressBar,
        BulletUI:cc.Node,
        NumBar:cc.Label,
        BG:cc.Node,
        BarLength:300
    },
    
    onLoad () 
    {
        this.UIMainNode = cc.find("Canvas/UIMain");
        if(!CC_WECHATGAME)
            return;
        var obj = wx.getLaunchOptionsSync();
        var Sence = obj.query.scene == undefined ? null : obj.query.scene;
        this._Sence = decodeURIComponent(Sence); //渠道过来的场景值
        this._AppID = obj.referrerInfo&&obj.referrerInfo.appId?obj.referrerInfo:"";
        this.LoadChildPack();

        window.GameConfig = GameConfig1;
        console.log("GameConfig",GameConfig1);
        this.version = GameConfig.version;
        this.Domain = GameConfig.Domain;
        this.SEVER_COUNT = GameConfig.SEVER_COUNT;
        this.Login();
    },

    LoadJson(data,action)
    {
        cc.loader.loadRes(data,cc.JsonAsset,function( err, res)
        {
            console.log("读取json配置" + res.json.version);
            action(res.json);
        });
    },

    Login()
    {
        var self = this;
        wx.login({
            success (res) {
                if (res.code) {
                    wx.request({
                        url: self.Domain + 'act=userinfo',
                        data: {
                            code: res.code,
                            nickName:"",
                            avatarUrl: "",
                            gender:"",
                            scene:self._Sence,
                            version: self.version,
                            uid:0,
                            appid:self._AppID
                        },
                        success (res) {
                            var Data =  res.data.data;
                            self.GetUser(Data);
                        },
                        fail()
                        {
                            if(self.SEVER_COUNT <= 0)
                            {
                                self.login();
                                self.SEVER_COUNT --;
                            }
                            else
                            {
                                wx.showToast({
                                    title: "请检查网络!",
                                    icon: 'success',
                                    duration: 1500
                                });
                            }
                           
                        }
                    });
                } 
            }
        })
    },

    GetUser(Data)
    {
        var self = this;
        self.Data = Data;
        wx.request({
            url: self.Domain + "act=user",
            data:
            {
                openid:self.Data.openid,
                version:self.version,
                scene:self._Sence,
                uid:0,
            },
            success (res) 
            {
                self.UserData = res.data.data;
                self.LoaderUIstart();
            },
            fail()
            {
                if(self.SEVER_COUNT <= 0)
                {
                    self.GetUser(Data);
                    self.SEVER_COUNT --
                }
                else
                {
                    wx.showToast({
                        title: "请检查网络!",
                        icon: 'success',
                        duration: 1500
                    })
                }
            }
        });
    },

    //加载子包
    LoadChildPack()
    {
        cc.loader.downloader.loadSubpackage("Case",(err)=>
        {
            if(err)
            {
                return console.error("分包加载失败");
            }
            //加载首页预制体
            this.LoadFirstPrefabs();
        })
    },

    Finish()
    {
        this.BG.active = false;
    },

    LoaderUIstart(prefab = null)
    {
        if(prefab != null)
        {
            this.UIStartPre = prefab;
            this.isloder  = true;
        }
        else
        {
            this.isSever = true;
            if(this.UIStartPre == undefined)
                return;
        }
        if(this.isSever == true && this.isloder == true)
        {   
            cc.find("Canvas").addComponent(require("GameGlobal"));
            var UINode = cc.instantiate(this.UIStartPre);
            this.UIStart = UINode;
            UINode.parent = this.UIMainNode;
            this.Finish();
        }
    },

    LoadFirstPrefabs()
    {
        cc.loader.loadRes('Prefabs/UIStart', cc.Prefab, this._progressCallback.bind(this),(err, prefab) => {
            this.LoaderUIstart(prefab);
        });
        
        cc.loader.loadResDir("Sound",cc.assets,function(completeCount, totalCount, res)
        {
            
        });

        cc.loader.loadResDir("Prefabs/UI",cc.assets,function(completeCount, totalCount, res)
        {

        });
    },

    _progressCallback(completeCount, totalCount, res)
    {
        var value = completeCount / totalCount ;
        this.ProgressBar.progress = completeCount / totalCount;
        var BulletUIValue = value * this.ProgressBar.node.width;
        if(BulletUIValue <= this.BarLength)
        {
            this.BulletUI.x = BulletUIValue - this.BarLength/2;
        }
        else
        {
            this.BulletUI.x = this.BarLength/2;
        }
        this.NumBar.string = Math.ceil(value*100)+"%";
    },
   
});
