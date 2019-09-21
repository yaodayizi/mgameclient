class RoomListBjlPanel extends eui.Component {	
	public list =[];
	public constructor() {
		super();
		this.skinName = "resource/skins/RoomListBjl.exml";
		this.roomList();
	}

	public roomList(){
		Net.SocketUtil.getAllRoomData(5,function(ret){
			if(ret){
				ret.forEach((roomData,index) =>{
						let room:RoomBjlPanle = new RoomBjlPanle();
						room.roomName = roomData.roomName;
						room.roomid = roomData.roomid;
						this.list.push(room);
						room.x = 30 + 30*index;
						room.y = 20 + (20+room.height)*index/2;
						if(index % 2 >0){
							room.x+=100;
						}
						room.addEventListener(egret.TouchEvent.TOUCH_TAP,this.roomClick,this);
						this.addChild(room);
						
				});	
			}
		});
	}

	public roomClick(e:egret.TouchEvent){
		let room:RoomBjlPanle = <RoomBjlPanle>e.target;
		Net.SocketUtil.joinRoom(room.roomid,function(ret){
			if(ret.code ==200){
				LCP.LListener.getInstance().dispatchEvent(new LCP.LEvent(EventData.Data.JOIN_ROOM,{roomid:room.roomid,data:ret.data}));
			}
			console.log('EventData.Data.JOIN_ROOM',ret);

         });
	}


	
}