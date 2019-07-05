

var HelperManager =  cc.Class({
    extends: require("BaseManager"),

    properties: {
       
    },

    onLoad()
    {
        this.urlList = [];
        this.sFlist = [];
        this.VideoCount = 7;
        this.DimondCount = 5;
        this.IsPassDay();
    },
    
    createImage(avatarUrl,ImgHead) {
        var index = -1;
        for(var i = 0;i<this.urlList.length;i++)
        {
            if(avatarUrl == this.urlList[i])
            {
                index = i;
                break;
            }
        }
        if(index==-1)
        {
            let image = window.wx.createImage();
            image.onload = function()
            {
                let texture = new cc.Texture2D();
                texture.initWithElement(image);
                texture.handleLoadedTexture();
                ImgHead.spriteFrame = new cc.SpriteFrame(texture);
            };
            image.src = avatarUrl;
        }
        else
        {
            ImgHead.spriteFrame = this.sFlist[index];
        }
    } ,

    LoaderImage(url,_sprite) {

        var index = -1;
        
        for(var i = 0;i<this.urlList.length;i++)
        {
            if(url == this.urlList[i])
            {
                index = i;
                break;
            }
        }
        
        if(index==-1)
        {
            var self = this;
            cc.loader.load(url, function (err, texture) {
                var spriteFrame  = new cc.SpriteFrame(texture);
                _sprite.spriteFrame = spriteFrame;
                self.urlList.push(url);
                self.sFlist.push(spriteFrame);
            });
        }
        else
        {
            _sprite.spriteFrame = this.sFlist[index];
        }
    },

    //是否过了一天
    IsPassDay()
    {
        var ItemDay = cc.sys.localStorage.getItem("Day");
        var ItemMonth = cc.sys.localStorage.getItem("Month");
        var data = new Date();
        var day = data.getUTCDate();
        var month = data.getUTCMonth();
        if(ItemDay === ""||ItemDay === null)
        {
            this.ReSetCount();
            cc.sys.localStorage.setItem("Day",day);
            cc.sys.localStorage.setItem("Month",month);
            return false ;//不需要重置道具
        }
        else
        {
            if(month-ItemMonth>0)
            {
                this.ReSetCount();
                cc.sys.localStorage.setItem("Day",day);
                cc.sys.localStorage.setItem("Month",month);
                return true ;//重置道具
            }
            else
            {
                if(day - ItemDay>0)
                {
                    this.ReSetCount();
                    cc.sys.localStorage.setItem("Day",day);
                    cc.sys.localStorage.setItem("Month",month);
                    return true; 
                }
                else
                {
                    return false;
                }
            }
        }
    },

//更新每天的次数
    ReSetCount()
    {
        cc.sys.localStorage.setItem("VideoCount",this.VideoCount);
    },

//限制今天看视频的次数
    GetAllVideoCount()
    {
        var Vcount = this.VideoCount;
        
        var ItemVideoCount = cc.sys.localStorage.getItem("VideoCount");
        if(ItemVideoCount === ""|| ItemVideoCount === null)
        {
            cc.sys.localStorage.setItem("VideoCount",Vcount);
            return Vcount;
        }
        else
        {
            return ItemVideoCount;
        }
    },

    ReductionVideoCount(Count)
    {
        Count--;
        cc.sys.localStorage.setItem("VideoCount",Count);
    },

    ToNumString(num)
    {   
        if(num >= 1000  && num < 1000000)
        {
            var Result = (num/1000).toFixed(1) + "K";
        }
        else if(num>=1000000 && num < 1000000000)
        {
            var Result = (num/1000000).toFixed(1) + "M";
        }
        else if(num<1000)
        {
            var Result = Number(num).toFixed(0);
        }
        return Result;
    }   
});
