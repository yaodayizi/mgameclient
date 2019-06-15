var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Global;
(function (Global) {
    var a = (function () {
        function a() {
        }
        return a;
    }());
    Global.a = a;
    __reflect(a.prototype, "Global.a");
})(Global || (Global = {}));
//# sourceMappingURL=Global.js.map