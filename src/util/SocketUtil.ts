module Net.SocketUtil {
/*        var  pomelo: Pomelo;
        var  isConnect: boolean = false;
		var  addEvents = [];*/
		export function  connect(host,port,callback=null){
			if(!this.pomelo){
				this.pomelo = new Pomelo();

			}
			this.pomelo.on('io-error',function(e){
				console.log('1io-error',e);
			});
			this.pomelo.on('error',function(e){
				console.log('1error',e);
			});
			this.pomelo.on('connect',function(res){
				console.log('1connect');
				this.isConnect = true;
			})
			this.pomelo.on('disconnect',function(res){
				console.log('1disconnect');	
			});
			this.pomelo.on('close',function(res){
				console.log('已掉线',res);
			});
			this.pomelo.on('heartbeat timeout',function(res){
				console.log('1heartbeat timeout');	
			});

			this.pomelo.on('playerLeave',function(res){
				console.log('用户离开',res);
			});


			this.pomelo.init({host:host,port:port,log:true},function(res0){
				this.pomelo.request('gate.gateHandler.queryEntry',{},function(res){
					this.pomelo.disconnect();
					if(res.code == 500){
						console.log(res.msg);
						return;
					}
					let config = {
						host:res.host,
						port:res.port,
						log:true
					}
					this.connectGameServer(config,callback);
				}.bind(this));
			}.bind(this));
		}	

		export function connectGameServer(config,callback){
			if(!this.pomelo){
				this.pomelo = new Pomelo();
			}

			this.pomelo.init(config,function(res0){
				console.log('init',res0);
				if(callback){
					callback();
				}
			}.bind(this));
		}

		export function login(username,password,callback){
			this.pomelo.request('connector.entryHandler.login',{username:username,password:password},function(ret){
				callback(ret);
			}.bind(this));
		}

		export function enterGame(gameType,token,roomid,callback){
			this.pomelo.request('connector.entryHandler.enterGame',{gameType:gameType,token:token,roomid:roomid},callback);
		}

		export function sendBet(pos,coin,chipType,num,callback){
			
			this.pomelo.request('bjl.gameHandler.bet',{pos:pos,coin:coin,chipType,num},function(ret){
				callback(ret);
			});
		}

		export function getAllRoomData(recordNum,callback){
			this.pomelo.request('bjl.gameHandler.getAllRoomData',{num:recordNum},function(ret){
				callback(ret);
			});
		}

		export function joinRoom(roomid,callback){
			this.pomelo.request('bjl.gameHandler.joinRoom',{roomid:roomid},function(ret){
				callback(ret);
			});
		}

		//退出游戏
		export function leaveRoom(data,callback){
			this.pomelo.request('bjl.gameHandler.leaveRoom',data,function(ret){
				callback(ret);
			});
		}


		export function addHandler(event,callback){
			this.pomelo.on(event,callback);
			//this.addEvents.push(event);
		}

		export function removeHandler(event){
			this.pomelo.off(event);
/*			let n = this.addEvents.indexOf(event);
			if(n>=0){
				this.addEvents.splice(n,1);
			}*/
		}

		export function dispatch(eventName,data){
			this.pomelo.emit(eventName,data);
			console.log('emit',eventName,data);
		}

/*		function disconnect(){
			LCP.LListener.getInstance().addEventListener(new LCP.LEvent(""))
		}*/


		


}