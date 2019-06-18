var TipsUtil;
(function (TipsUtil) {
    function alert(msg, callback, thisObj) {
        tips.call(thisObj ? thisObj : this, {
            title: '提示',
            content: msg,
            buttons: [
                {
                    text: 'OK', onClick: function (e, sprite) {
                        if (sprite.parent)
                            sprite.parent.removeChild(sprite);
                    }
                }
            ],
            timeout: 0,
        });
    }
    TipsUtil.alert = alert;
    function tips(options, thisObj) {
        thisObj = thisObj ? thisObj : this;
        var _options = {
            textColor: options.color || 0x0,
            fontFamily: options.fontFamily || 'Microsoft Yahei',
            backgoundColor: options.color || 0xffffff,
            title: options.title || "",
            content: options.content || "",
            timeout: !options.buttons && !options.timeout ? 1500 : 0,
            buttons: options.buttons || [],
            width: options.width || thisObj.stage.stageWidth * 0.75,
            height: options.height || thisObj.stage.stageHeight * 0.3,
        };
        var mask = new egret.Sprite;
        mask.graphics.beginFill(0x0, 0.25);
        mask.graphics.drawRect(0, 0, thisObj.stage.stageWidth, thisObj.stage.stageHeight);
        mask.graphics.endFill();
        thisObj.stage.addChild(mask);
        var tips = new egret.Sprite;
        tips.graphics.beginFill(_options.backgoundColor, 0.95);
        tips.graphics.drawRoundRect(0, 0, _options.width, _options.height, 50);
        tips.graphics.endFill();
        tips.x = (thisObj.stage.stageWidth - _options.width) / 2;
        tips.y = (thisObj.stage.stageHeight - _options.height) / 2;
        thisObj.stage.addChild(tips);
        var title = new egret.TextField;
        title.name = 'title';
        title.textColor = _options.textColor;
        title.fontFamily = _options.fontFamily;
        title.size = 35;
        title.text = _options.title;
        title.textAlign = egret.HorizontalAlign.CENTER;
        title.verticalAlign = egret.VerticalAlign.MIDDLE;
        title.x = 0;
        title.y = 0;
        title.width = tips.width;
        title.height = 70;
        tips.addChild(title);
        var buttons = new egret.Sprite;
        buttons.name = 'buttons';
        var onClick = function (e) {
            e.stopPropagation();
            for (var i = 0; i < buttons.numChildren; ++i)
                if (buttons.getChildAt(i).hashCode == e.currentTarget.hashCode)
                    if (_options.buttons[i].onClick)
                        _options.buttons[i].onClick.call(thisObj, e, tips);
        };
        if (_options.buttons.length > 0) {
            buttons.x = title.x;
            buttons.y = tips.height - 75; //固定75px
            buttons.width = title.width;
            buttons.height = 75;
            var cell = buttons.width / _options.buttons.length;
            //画线
            buttons.graphics.lineStyle(1, 0xcccccc);
            buttons.graphics.moveTo(0, 0);
            buttons.graphics.lineTo(buttons.width, 0);
            for (var i = 1; i < _options.buttons.length; i++) {
                buttons.graphics.moveTo(cell * i, buttons.width);
                buttons.graphics.lineTo(cell * i, buttons.height);
            }
            for (var i = 0; i < _options.buttons.length; i++) {
                var btn = new egret.TextField, _b = _options.buttons[i];
                btn.name = 'button-' + i;
                btn.x = cell * i;
                btn.y = 1;
                btn.fontFamily = _options.fontFamily;
                btn.width = cell;
                btn.height = buttons.height;
                btn.textColor = _options.textColor;
                btn.textAlign = egret.HorizontalAlign.CENTER;
                btn.verticalAlign = egret.VerticalAlign.MIDDLE;
                btn.text = _b.text;
                btn.touchEnabled = true;
                btn.addEventListener(egret.TouchEvent.TOUCH_TAP, onClick, thisObj);
                buttons.addChild(btn);
            }
        }
        tips.addChild(buttons);
        var content = new egret.TextField;
        content.name = 'content';
        content.textColor = _options.textColor;
        content.fontFamily = _options.fontFamily;
        content.size = 20;
        content.text = _options.content;
        content.textAlign = egret.HorizontalAlign.LEFT;
        content.verticalAlign = egret.VerticalAlign.TOP;
        content.x = title.x + 15;
        content.y = title.height;
        content.width = title.width - 30;
        content.height = tips.height - title.y - title.height - buttons.height;
        tips.addChild(content);
        tips.touchEnabled = true;
        tips.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
        }, thisObj, true, 10);
        tips.addEventListener(egret.Event.REMOVED_FROM_STAGE, function (e) {
            if (mask.parent)
                mask.parent.removeChild(mask);
        }, thisObj);
        if (_options.timeout > 0)
            setTimeout(function () {
                if (tips.parent)
                    tips.parent.removeChild(tips);
            }, _options.timeout);
        return {
            setTitle: function (_title) {
                title.text = _title;
            },
            setContent: function (_content) {
                content.text = _content;
            },
            setButton: function (index, text, callback) {
                var btn = buttons.getChildAt(index);
                if (!btn)
                    return;
                btn['text'] = text;
                if (callback)
                    _options.buttons[index].onClick = callback;
            }
        };
    }
    TipsUtil.tips = tips;
})(TipsUtil || (TipsUtil = {}));
