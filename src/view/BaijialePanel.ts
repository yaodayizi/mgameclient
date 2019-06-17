class BaijialePanel extends eui.Component {
public imgMask:eui.Rect;
public chipGroup:eui.Group;
public cardGroupPlayer:eui.Group;
public cardGroupBanker:eui.Group;
public statusText:eui.Group;
private statusTextTimeout = 0;
	public constructor() {
		super();
		this.skinName = "resource/skins/Baijiale.exml";
		this.runGame();
	}

	public runGame(){

		var self = this;

		Net.SocketUtil.addHandler(EventData.Data.PLAYER_ENTER,function(ret){
			console.log('player join game',ret);
		});



		Net.SocketUtil.addHandler(EventData.Data.GAME_START,function(ret){
			console.log('game_start',ret);
			self.setStatusText('开始游戏');
		});
		Net.SocketUtil.addHandler(EventData.Data.GAME_BET_ENTER,function(ret){
			self.setStatusText('开始下注');
			console.log(EventData.Data.GAME_BET_ENTER,ret);
		});
		Net.SocketUtil.addHandler(EventData.Data.GAME_BET_LEAVAL,function(ret){
			console.log(EventData.Data.GAME_BET_LEAVAL,ret);
			self.setStatusText('下注结束');
		});
		Net.SocketUtil.addHandler(EventData.Data.GAME_END,function(ret){
			console.log(EventData.Data.GAME_END,ret);
			
		});
		Net.SocketUtil.addHandler(EventData.Data.PLAYER_LEVAL,function(ret){
			console.log(EventData.Data.PLAYER_LEVAL,ret);
		});

		Net.SocketUtil.enterGame(1000,Global.user.token,function(ret){
			console.log('enter_game',ret);
			//LCP.LListener.getInstance().dispatchEvent(new LCP.LEvent('enter_game',ret));
		});
	}

	public setStatusText(text,time=2000){

		let label:eui.Label = <eui.Label>this.statusText.getChildByName('statusLabel');
		label.text = text;
		this.statusText.visible = true;
/*		clearTimeout(this.statusTextTimeout);
		this.statusTextTimeout = setTimeout(function(){
			this.statusText.visible = false;
		}.bind(this),time)*/

	}
}