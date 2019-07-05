
var SoundManager =  cc.Class({
    extends: require("BaseManager"),

    properties: {
       
    },

    onLoad()
    {
        this.AduioClipList = [];
        //this.SoundToggle = true; //音乐开关
        this.Volume = 0.3;
        this.SoundToggle = false;
        //this.PlayMusic("背景");
        this.HurtId = -1;
        this.isplayHurt = false;
        this.Timer = 0.5;
    },
    
    //播放音效
    PlaySound(name)
    {
        if(this.SoundToggle)
            return;
        this.LoaderClip(name).then((clip)=>
        {
            cc.audioEngine.play(clip,false,this.Volume);
        });
    },

    PlayLongSound(name)
    {
        if(this.SoundToggle)
            return;
        if(this.isplayHurt)
            return;
        this.isplayHurt = true;
        
        this.LoaderClip(name).then((clip)=>
        {
            this.HurtId =  cc.audioEngine.play(clip,false,0.3);
            cc.audioEngine.setFinishCallback(this.HurtId,()=>
            {
                this.isplayHurt = false;
            })
        });
    },
    
    StopLongSound()
    {
        if(this.HurtId>=0)
        {
            cc.audioEngine.stop(this.HurtId);
        }
        this.isplayHurt = false;
    },

    //播放音乐
    PlayMusic(name)
    {
        if(this.SoundToggle)
        {
            cc.audioEngine.stopMusic();
            return;
        }
        this.LoaderClip(name).then((clip)=>
        {
            cc.audioEngine.playMusic(clip,true);
        });
    },
    //加载声音文件
    LoaderClip(name)
    {
        return new Promise((resolve, reject) => {
            if(this.AduioClipList[name] == undefined)
            {
                var path = "Sound/" + name;
                cc.loader.loadRes(path,cc.AudioClip,(err,clip)=>
                {
                    this.AduioClipList[name] = clip;
                    resolve(clip);
                })
            }
            else
            {
                resolve(this.AduioClipList[name]);
            }
        });
    },

    update(dt)
    {
        if(this.isplayHurt)
        {
            this.Timer -= dt;
            if(this.Timer <= 0)
            {
                this.Timer = 0.5;
                this.StopLongSound();
            }
        }
        
    }
});
