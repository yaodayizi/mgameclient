class BaijialePanel extends eui.Component {
	private imgMask: eui.Rect;
	private chipGroup: eui.Group;
	private cardGroupPlayer: eui.Group;
	private cardGroupBanker: eui.Group;
	private statusText: eui.Group;
	private statusLabel:eui.Label;
	private playerCards = [];
	private bankerCards = [];
	private result = {};
	private suitMapping = { "spade": "A", "heart": "B", "club": "C", "diamond": "D" };
	private cardWidth = 0;
	private statusTextTimeout = 0;
	private dealTimeout = 0;
	private playerPointLabel:eui.Label;
	private bankerPointLabel:eui.Label;

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
			this.cardGroupPlayer.visible = false;
			this.cardGroupBanker.visible = false;
			this.bankerPointLabel.visible = true;
			this.playerPointLabel.visible = true;

			//this.setStatusText('开始游戏');

		}.bind(self));
		Net.SocketUtil.addHandler(EventData.Data.GAME_BET_ENTER, function (ret) {
			this.setStatusText('已开局请下注');
			console.log(EventData.Data.GAME_BET_ENTER, ret);
		}.bind(self));

		Net.SocketUtil.addHandler(EventData.Data.GAME_BET_LEAVA, function (ret) {
			console.log(EventData.Data.GAME_BET_LEAVA, ret);
			this.setStatusText('下注结束');
		}.bind(self));

		Net.SocketUtil.addHandler(EventData.Data.GAME_END, function (ret) {
			console.log(EventData.Data.GAME_END, ret);
			this.result = ret;
			this.deal(ret);
		}.bind(self));

		Net.SocketUtil.addHandler(EventData.Data.PLAYER_LEVA, function (ret) {
			console.log(EventData.Data.PLAYER_LEVA, ret);
		
		}.bind(self));

		Net.SocketUtil.enterGame(1000, Global.user.token, function (ret) {
			console.log('enter_game', ret);

			//LCP.LListener.getInstance().dispatchEvent(new LCP.LEvent('enter_game',ret));
		}.bind(self));

		this.setCards(this.cardGroupPlayer, this.playerCards);
		this.setCards(this.cardGroupBanker, this.bankerCards);
		LCP.LListener.getInstance().addEventListener(EventData.Data.SHOW_RESULT,this.showResult,this);

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
		/*		let stack = [this.playerCards[0],this.bankerCards[0],this.playerCards[1],this.bankerCards[1],this.playerCards[2],this.bankerCards[2]];
				let card = stack.shift();
				let width = card.width;*/
		//this.playerCards[0].visible = true;

		let j = 0;
		let i = 0;
		let pos = 'player';

		let dealCard = function (i, j, pos) {
			let m = 0;
			let data;
			if (pos == 'player') {
				data = ret.cards[pos][i];
				let attr = i > 1 ? 'height' : 'width';
				this.dealEff(this[pos+'Cards'][i],data,attr);
				i++;
				pos = 'banker';
				m = j;
			} else {
				data = ret.cards[pos][j];
				let attr = i > 1 ? 'height' : 'width';
				this.dealEff(this[pos+'Cards'][j],data,attr);
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

	private dealEff(card, retCardVal, attr) {
		let change = function (obj) {
			if (card.scaleX == 0) {
				let value = this.getCardVal(obj.cardVal);
				let texture:egret.Texture = RES.getRes(value + "_png");
				obj.card.texture =texture;
			}
		}
		let attrVal = card[attr];

		//let toObj = attr == 'width' ? {width:0} : {height:0};
		//let toObj2 = attr == 'width' ? {width:attrVal} : {height:attrVal};
		let params = { card: card, cardVal: retCardVal,attr:attr };
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
		let str = '';
		switch(this.result['win']){
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

		setTimeout(function(){
			this.bankerPointLabel.visible = false;
			this.playerPointLabel.visible = false;

		}.bind(this),1000)
		this.setStatusText(str,1000);

	}

	private setCards(cards, arr) {
		let childrenNum = cards.numChildren;
		for (let i = 0; i < childrenNum; i++) {
			var img:eui.Image = <eui.Image>cards.getChildAt(i);
			arr.push(img);
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

}