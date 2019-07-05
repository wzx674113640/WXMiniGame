var UIManager = require("UIManager");
var SeverManager = require("SeverManager");
var AdsManager = require("AdsManager");
var SoundManager = require("SoundManager");
var HelperManager = require("HelperManager");
//var SubManager = require("SubManager");
var MsgCenter = require("MsgCenter");
var HintManager = require("HintManager");
var EffectManager = require("EffectManager");


var GameGlobal = cc.Class({
    extends: cc.Component,

    onLoad()
    {
        window.GameGlobal = this;

        this.UIManager = new UIManager();
        this.SeverManager = new SeverManager();
        this.AdsManager = new AdsManager();
        this.SoundManager = new SoundManager();
        this.HelperManager = new HelperManager();
        //this.SubManager = new SubManager();
        this.HintManager = new HintManager();
        this.EffectManager = new EffectManager();

        this.MsgCenter = MsgCenter;
    
        this.SeverManager.onLoad();
        this.UIManager.onLoad();
        this.AdsManager.onLoad();
        this.SoundManager.onLoad();
        this.HelperManager.onLoad();
        //this.SubManager.onLoad();
        this.HintManager.onLoad();
        this.EffectManager.onLoad();
    },
    
    start()
    {
        this.SeverManager.start();
        this.UIManager.start();
        this.AdsManager.start();
        this.SoundManager.start();
        this.HelperManager.start();
        //this.SubManager.start();
        this.HintManager.start();
        this.EffectManager.start();
    },

    update(dt)
    {
        //this.SubManager.update(dt);
        this.SoundManager.update(dt);
    }
}); 
