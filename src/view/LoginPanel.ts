class LoginPanel extends eui.Component {
	public username:eui.EditableText;
	public password:eui.EditableText;
	public loginBtn:eui.Button;
	//public travelBtn:eui.Button;

	public constructor() {
		super();
		this.skinName = "resource/skins/LoginSkin.exml";
		Net.SocketUtil.connect('127.0.0.1',9115);

		
		this.loginBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.loginBtnClick,this);
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
			
			if(res.code ==200){
				LCP.LListener.getInstance().dispatchEvent(new LCP.LEvent(EventData.Data.LOGIN_SUCCESS,res));
			}else{
				TipsUtil.alert(res.err.msg,function(){},this);
			}
		}.bind(this));

	}

	public dispose(){
		this.loginBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.loginBtnClick,this);
		if(this.parent){
			this.parent.removeChild(this);
		}
	}

}