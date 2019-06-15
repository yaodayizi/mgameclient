class LoginPanel extends eui.Component {
	public username:eui.TextInput;
	public password:eui.TextInput;
	public loginBtn:eui.Button;
	public travelBtn:eui.Button;

	public constructor() {
		super();
		this.skinName = "resource/skins/LoginSkin.exml";
		Net.SocketUtil.connect('127.0.0.1',9115);
	}

	private loginBtnClick(e){
        if (this.password.text == "" || this.password.text.length > 20 || this.password.text.length < 2) {
            let tip = TipsUtil.alert("请输入有效密码!",null,this);
            return;
        }
        if (this.username.text == "" || this.username.text.length > 20 || this.username.text.length < 2) {
            TipsUtil.alert("请输入有效用户名!",null,this);
			return;
        } 

		Net.SocketUtil.login(this.username.text,this.password.text,function(res){
			console.log('login',res);
		})

	}

}