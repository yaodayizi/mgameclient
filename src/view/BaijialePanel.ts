class BaijialePanel extends eui.Component {
	private imgMask: eui.Rect;
	private chipGroup: eui.Group;
	private cardGroupPlayer: eui.Group;
	private cardGroupBanker: eui.Group;
	private betPosGroup:eui.Group;
	private userHeadPanel:UserHeadPanel;

	private statusText: eui.Group;
	private statusLabel:eui.Label;
	private timerLabel:eui.Label;
	private playerCards = [];
	private bankerCards = [];
	private result = {};
	private chips = [];
	private betPos = [];
	//其他人下注
	private otherBets = {};
	private bets = {};
	private betsTotal = {};
	private selectedChipImg:eui.Image;
	private selectedChipVal = 0;
	private suitMapping = { "spade": "A", "heart": "B", "club": "C", "diamond": "D" };
	private cardWidth = 0;
	private statusTextTimeout = 0;
	private dealTimeout = 0;
	private playerPointLabel:eui.Label;
	private bankerPointLabel:eui.Label;
	private debounceTimeid =0;
	private timer:egret.Timer;
	private betTime =0;


	public constructor() {
		super();
		this.skinName = "resource/skins/Baijiale.exml";
		this.runGame();
	}

	public runGame() {

		var self = this;

		Net.SocketUtil.addHandler(EventData.Data.PLAYER_ENTER, function (ret) {
			console.log('player join game', ret);
		});


		
		Net.SocketUtil.addHandler(EventData.Data.GAME_START, function (ret) {
			console.log(EventData.Data.GAME_START, ret);
			//this.setStatusText('开始游戏');
			this.timer.stop();
			this.timer.reset();
			for(let key in this.bets){
				this.bets[key] = {gold:0,count:0};
				this.betsTotal[key] = {gold:0};
			}



		}.bind(self));
		Net.SocketUtil.addHandler(EventData.Data.GAME_BET_ENTER, function (ret) {
			this.setStatusText('已开局请下注');
			this.betTime = ret.bet_time;
			if(!this.timer.hasEventListener(egret.TimerEvent.TIMER)){
				this.timer.addEventListener(egret.TimerEvent.TIMER,function(){
					this.betTime--;
					this.timerLabel.text = this.betTime;
					if(this.betTime == 1){
						console.log('下注时间已过');
					}
				},this);
			}
			this.timer.start();
			console.log(EventData.Data.GAME_BET_ENTER, ret);
			this.betPos.forEach(function(val,index){
				val.touchEnabled = true;
			});
		}.bind(self));

		Net.SocketUtil.addHandler(EventData.Data.GAME_BET_LEAVA, function (ret) {
			this.timer.stop();
			this.timer.reset();

			this.betPos.forEach(function(val,index){
				val.touchEnabled = false;
			});
			console.log(EventData.Data.GAME_BET_LEAVA, ret);
			this.setStatusText('下注结束');
		}.bind(self));

		//其他玩家下注
		Net.SocketUtil.addHandler(EventData.Data.GAME_BET, function (ret) {
			console.log('下注---',ret);
			if(ret.uid == Global.user.userid){
				return;
			}
			this.otherBets[ret.uid] = ret;
			let rectName = 'betPos_'+ret.pos;
			let chipName = 'c'+ret.chipType;
			let rect:eui.Rect = this.betPosGroup.getChildByName(rectName);
			let chip:eui.Image = this.chipGroup.getChildByName(chipName);
			let x = Math.round(rect.width * Math.random()-10);
			let y = Math.round(rect.height*Math.random()-10);
			console.log('uid:',ret.uid,'下注:',ret.coin);
			for(let i=0;i<ret.num;i++){
				this.addBetInRect(rect,chip,x,y);
			}
			

			
		}.bind(self));

		Net.SocketUtil.addHandler(EventData.Data.GAME_END, function (ret) {
			console.log(EventData.Data.GAME_END, ret);
			this.betTime = ret.show_result_time;
			this.timer.start();
			this.result = ret;
			this.deal(ret);
		}.bind(self));

		Net.SocketUtil.addHandler(EventData.Data.PLAYER_LEVA, function (ret) {
			console.log(EventData.Data.PLAYER_LEVA, ret);
		
		}.bind(self));

		Net.SocketUtil.enterGame(1000, Global.user.token, function (ret) {
			console.log('enter_game', ret);
			this.hideEl();
			//LCP.LListener.getInstance().dispatchEvent(new LCP.LEvent('enter_game',ret));
		}.bind(self));


		this.timer = new egret.Timer(1000,0);
		this.imgMask.visible = false;
		this.getArrByGroup(this.cardGroupPlayer, this.playerCards);
		this.getArrByGroup(this.cardGroupBanker, this.bankerCards);
		this.getArrByGroup(this.chipGroup,this.chips);
		this.getArrByGroup(this.betPosGroup,this.betPos);
		this.chipSelected(this.chips[0]);
		this.chips.forEach(function(val,index){
			let chip:eui.Image = <eui.Image>val;
			chip.touchEnabled = true;
			chip.addEventListener(egret.TouchEvent.TOUCH_TAP,this.chipClick,this);
		}.bind(this));

		this.betPos.forEach(function(val,index){
			let rect:eui.Rect = <eui.Rect>val;
			rect.touchEnabled = false;
			rect.addEventListener(egret.TouchEvent.TOUCH_TAP,this.betPosClick,this);
			let pos = rect.name.replace('betPos_','');
			this.bets[pos] = {
				gold:0,
				count:0
			}
			this.betsTotal[pos] = 0;
		}.bind(this));
		

		//this.betPosGroup


		LCP.LListener.getInstance().addEventListener(EventData.Data.SHOW_RESULT,this.showResult,this);

		this.userHeadPanel.gold = Global.user.gold;
		this.userHeadPanel.userName = Global.user.user_name;

/*		let ret = {
			 "result": { "pair": "none", "win": "banker", "natural": "none" }, 
			 "cards": { 
				"player": [{ "suit": "heart", "value": "5" }, { "suit": "spade", "value": "6" }, { "suit": "heart", "value": "2" }],
			  	"banker": [{ "suit": "diamond", "value": "7" }, { "suit": "heart", "value": "7" }, { "suit": "diamond", "value": "A" }] 
			}, 
			"value": { "player": 3, "banker": 5 } 
			}
		this.deal(ret);*/
	}

	private setStatusText(text, time = 2000) {

		this.statusLabel.text = text;
		this.statusText.visible = true;
		clearTimeout(this.statusTextTimeout);
		this.statusTextTimeout = setTimeout(function () {
			this.statusText.visible = false;
		}.bind(this), time);

	}

	private deal(ret) {
		this.playerCards.forEach(function(val,index){
			val.visible = false;
			val.texture = RES.getRes('single_back_png');
		}.bind(this));
		this.bankerCards.forEach(function(val,index){
			val.visible = false;
			val.texture = RES.getRes('single_back_png');
		}.bind(this));
		this.cardGroupPlayer.visible = true;
		this.cardGroupBanker.visible = true;
		this.imgMask.visible = true;

		let j = 0;
		let i = 0;
		let pos = 'player';

		let dealCard = function (i, j, pos) {
			let m = 0;
			let data;
			if (pos == 'player') {
				data = ret.cards[pos][i];
				this.dealEff(this[pos+'Cards'][i],data);
				i++;
				pos = 'banker';
				m = j;
			} else {
				data = ret.cards[pos][j];
				this.dealEff(this[pos+'Cards'][j],data);
				pos = 'player';
				j++;
				m = i;
			}
			console.log(data);
			if (ret.cards[pos].length - 1 >= m) {
				setTimeout(dealCard.bind(this, i, j, pos), 1000);
			}
			if(i+j == ret.cards.banker.length + ret.cards.player.length){
				//显示牌结束
				LCP.LListener.getInstance().dispatchEvent(new LCP.LEvent('showResult'));
			}
		}.bind(this);
		dealCard(i, j, pos);

	}

	private dealEff(card, retCardVal) {
		let change = function (obj) {
			if (card.scaleX == 0) {
				let value = this.getCardVal(obj.cardVal);
				let texture:egret.Texture = RES.getRes(value + "_png");
				obj.card.texture =texture;
			}
		}
		let attrVal = card.scaleX;

		//let toObj = attr == 'width' ? {width:0} : {height:0};
		//let toObj2 = attr == 'width' ? {width:attrVal} : {height:attrVal};
		let params = { card: card, cardVal: retCardVal};
		var tw = egret.Tween.get(card, {})
			.to({ visible: true }, 100)
			.to({scaleX:0}, 200).call(change, this, [params])
			.wait(0)
			.to( {scaleX:1}, 200).call(function(tw){
				//egret.Tween.removeTweens(tw);
				
			},this,[tw]);

	}

	private showResult()
	{
		this.playerPointLabel.text = this.result['value'].player;
		this.bankerPointLabel.text = this.result['value'].banker;
		this.bankerPointLabel.visible = true;
		this.playerPointLabel.visible = true;
		for(let key in this.result['userGold']){
			if(key = Global.user.userid){
				this.userHeadPanel.gold = this.result['userGold'][key];
			}
		}
		let str = '';
		switch(this.result['result']['win']){
			case EventData.GameResult.TIE:
				str = '和';
				break;
			case EventData.GameResult.BANKER:
				str = '庄赢';
				break;
			case EventData.GameResult.player:
				str = '闲赢';
				break;
		}
		if(this.result['result']['pair']!=EventData.GameResult.NO_PAIR){
			//str+=' \n ';
		}
		switch(this.result['result']['pair']){
			case EventData.GameResult.BOTH:
				str+='庄对 闲对';
				break;
			case EventData.GameResult.BANKER:
				str+='庄对';
				break;
			case EventData.GameResult.player:
				str+='闲对';
				break;
			
		}

		setTimeout(function(){
			this.hideEl();
			this.clearBet();
		}.bind(this),15000);
		console.log(str);
		this.setStatusText(str,15000);

	}

	private hideEl(){
			
			this.cardGroupPlayer.visible = false;
			this.cardGroupBanker.visible = false;
			this.bankerPointLabel.visible = false;
			this.playerPointLabel.visible = false;
			this.imgMask.visible = false;
	}


	private getArrByGroup(group, arr) {
		let childrenNum = group.numChildren;
		for (let i = 0; i < childrenNum; i++) {
			var item = group.getChildAt(i);
			arr.push(item);
		}
	}




	private getCardVal(cardVal) {
		let suit = this.suitMapping[cardVal.suit];
		let val = 0;
		switch (cardVal.value) {
			case "A":
				val = 1;
				break;
			case "J":
				val = 11;
				break;
			case "Q":
				val = 12;
				break;
			case "K":
				val = 13;
				break;
			default:
				val = cardVal.value;
		}
		return val + suit;
	}

	private chipClick(e:egret.TouchEvent){
		let chip:eui.Image = <eui.Image>e.target;
		this.chipSelected(chip);
	}

	private chipSelected(chip:eui.Image){
		chip.scaleX = chip.scaleY = 1.2;
		this.selectedChipImg = chip;
		this.selectedChipVal = parseInt(chip.name.replace('c',''));

		this.chips.forEach(function(val,index){
			let item:eui.Image = <eui.Image>val;
			if(item.name != chip.name){
				item.scaleX = item.scaleY = 1;
			}
		}.bind(this));

	}

	private betPosClick(e:egret.TouchEvent){
		let rect:eui.Rect = <eui.Rect>e.target;
		let pos = rect.name.replace('betPos_','');
		//this.bets[pos][this.selectedChipVal]['count'] ++;
		this.bets[pos]['gold'] += this.selectedChipVal;
		this.bets[pos]['count'] ++;
		let point:egret.Point = new egret.Point();
		let offsetX = Math.round(Math.random()*20-10);
		let offsetY = Math.round(Math.random()*20-10);
		rect.globalToLocal(e.stageX,e.stageY,point);
		
		let imgArr = [];
		for(let i=0;i<this.bets[pos]['count'];i++){
			let index = this.addBetInRect(rect,this.selectedChipImg,point.x+offsetX,point.y+offsetY);
			imgArr.push(index);
		}
		//let de = this.debounce(this.sendBet,300);
		//de(pos,this.[pos]['gold']);

		
		this.debounce(this.sendBet,500)(pos,this.bets[pos].gold,this.selectedChipVal,this.bets[pos].count,imgArr,rect); 
	}

	private addBetInRect(rect:eui.Rect,chipImg:eui.Image,x,y){
		let img:eui.Image = new eui.Image(chipImg.texture);
		img.scaleX = img.scaleY = 0.5;
		let index = rect.numChildren+1;
		img.name = 'img'+index;
		rect.addChildAt(img,index);
		img.x = x;
		img.y = y;
		console.log('---2',x,y);
		return img.name;
	}

	private sendBet(pos,coin,chipType,num,imgArr,rect){
		this.bets[pos]['gold'] = 0;
		this.bets[pos]['count'] = 0;

		Net.SocketUtil.sendBet(pos,coin,chipType,num,function(ret){
			console.log(ret);
			if(ret!="OK"){
				console.log('imgArr',imgArr);
				let num = rect.numChidren;
				imgArr.forEach(function(val,index){
					let img = rect.getChildByName(val);
					if(img){
						setTimeout(function(){
						rect.removeChild(img);
						console.log('remove',img.name);
						}.bind(this),1000*index);
					}
				})
				imgArr =[];
				console.log(ret,'下注失败');

			}else{
				this.userHeadPanel.gold -= coin;
				this.betsTotal[pos]['gold']+=coin;
				console.log('下注成功',pos,coin,chipType,num,this.betsTotal);
			}
		}.bind(this));
	}

	private clearBet(){
		this.betPos.forEach(function(val,index){
			let rect:eui.Rect = <eui.Rect>val;
			let num = rect.numChildren;
			for(let i=rect.numChildren-1;i>=0;i--){
				rect.removeChildAt(i);
			}
		})
	}

	private debounce(fun,wait){
		var context = this;
		return function(pos,coin,chipType,num,img,rect){
			
			var args = arguments;
			clearTimeout(context.debounceTimeid);
			console.log(context.debounceTimeid);
			context.debounceTimeid = setTimeout(function(){
				fun.apply(context,args);
			},wait);
		}
	}


}