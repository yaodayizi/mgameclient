var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var LoginPanel = /** @class */ (function (_super) {
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
