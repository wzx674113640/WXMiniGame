

cc.Class({
    extends: require("BaseManager"),

    properties: {
        
    },

    onLoad()
    {
        this.TXList = [];
    },


    LoaderPrefab(name)
    {
        return new Promise((resolve, reject) => {
            if(this.TXList[name] == undefined)
            {
                var path = "TX/" + name;
                cc.loader.loadRes(path,cc.Prefab,(err,prefab)=>
                {
                    this.TXList[name] = prefab;
                    resolve(prefab);
                })
            }
            else
            {
                resolve(this.TXList[name]);
            }
        });
    }   

});
