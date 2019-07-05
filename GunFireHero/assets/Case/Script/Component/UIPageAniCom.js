var EnumDirection = cc.Enum({
    Left: 0,
    Right: 1 ,
    Up: 2,
    Down: 3
});


cc.Class({
    extends: cc.Component,
    
    properties: {
        Direction: {
            type: cc.Enum(EnumDirection),
            default: EnumDirection.Left
        },
        Distance: 100,
        DelayTime: 0,
        Timer:0.5
    },

    PlayAni()
    {
        var vec2 = cc.v2(0,0);
        switch(this.Direction)
        {
            case EnumDirection.Left:
                    vec2 = cc.v2(-this.Distance,0);
                break;
            case EnumDirection.Right:
                    vec2 = cc.v2(this.Distance,0);    
                break;
            case EnumDirection.Up:
                    vec2 = cc.v2(0,this.Distance);    
                break;   
            case EnumDirection.Down:
                    vec2 = cc.v2(0,-this.Distance);    
                break;  
        }
        var delayTime = cc.delayTime(this.DelayTime);
        var move = cc.moveBy(this.Timer,vec2);
        move.easing(cc.easeBackInOut());
        this.node.runAction(cc.sequence(delayTime,move));
    },

    TurnAni()
    {
        var vec2 = cc.v2(0,0);
        switch(this.Direction)
        {
            case EnumDirection.Left:
                    vec2 = cc.v2(this.Distance,0);
                break;
            case EnumDirection.Right:
                    vec2 = cc.v2(-this.Distance,0);    
                break;
            case EnumDirection.Up:
                    vec2 = cc.v2(0,-this.Distance);    
                break;   
            case EnumDirection.Down:
                    vec2 = cc.v2(0,this.Distance);    
                break;  
        }
        var delayTime = cc.delayTime(this.DelayTime);
        var move = cc.moveBy(this.Timer,vec2);
        move.easing(cc.easeBackInOut());
        this.node.runAction(cc.sequence(delayTime,move));
    }

});
