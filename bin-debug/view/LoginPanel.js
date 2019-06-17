var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var LoginPanel = (function (_super) {
    __extends(LoginPanel, _super);
    function LoginPanel() {
        var _this = _super.call(this) || this;
        _this.skinName = "resource/skins/LoginSkin.exml";
        Net.SocketUtil.connect('127.0.0.1', 9115);
        _this.loginBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.loginBtnClick, _this);
        return _this;
    }
    LoginPanel.prototype.loginBtnClick = function (e) {
        if (this.password.text == "" || this.password.text.length > 20 || this.password.text.length < 2) {
            var tip = TipsUtil.alert("请输入有效密码!", null, this);
            return;
        }
        if (this.username.text == "" || this.username.text.length > 20 || this.username.text.length < 2) {
            TipsUtil.alert("请输入有效用户名!", null, this);
            return;
        }
        Net.SocketUtil.login(this.username.text, this.password.text, function (res) {
            console.log('login', res);
            if (res.code == 200) {
                LCP.LListener.getInstance().dispatchEvent(new LCP.LEvent(EventData.Data.LOGIN_SUCCESS, res));
            }
            else {
                TipsUtil.alert(res.err.msg, function () { }, this);
            }
        }.bind(this));
    };
    LoginPanel.prototype.dispose = function () {
    };
    return LoginPanel;
}(eui.Component));
__reflect(LoginPanel.prototype, "LoginPanel");
//# sourceMappingURL=LoginPanel.js.map