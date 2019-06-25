module Net.SocketUtil {
/*        var  pomelo: Pomelo;
        var  isConnect: boolean = false;
		var  addEvents = [];*/
		export function  connect(host,port){
			if(!this.pomelo){
				this.pomelo = new Pomelo();
			}
			this.pomelo.on('io-error',function(e){
				console.log('io-error',e);
			});
			this.pomelo.on('error',function(e){
				console.log('error',e);
			});
			this.pomelo.on('connect',function(res){
				console.log('connect');
				this.isConnect = true;
			})
			this.pomelo.on('disconnect',function(res){
				console.log('disconnect');	
			});
			this.pomelo.on('close',function(res){
				console.log('close');	
			});
			this.pomelo.on('heartbeat timeout',function(res){
				console.log('heartbeat timeout');	
			});


			this.pomelo.init({host:host,port:port,log:true},function(res0){
				this.pomelo.request('gate.gateHandler.queryEntry',{},function(res){
					this.pomelo.disconnect();
					if(res.code == 500){
						console.log(res.msg);
						return;
					}
					this.connectGameServer({host:res.host,port:res.port,log:true});
				}.bind(this));
			}.bind(this));
		}	

		export function connectGameServer(config,callback){
			if(!this.pomelo){
				this.pomelo = new Pomelo();
			}

			this.pomelo.init(config,function(res0){
				console.log('init',res0);
			}.bind(this));
		}

		export function login(username,password,callback){
			this.pomelo.request('connector.entryHandler.login',{username:username,password:password},function(ret){
				callback(ret);
			}.bind(this));
		}

		export function enterGame(gameType,token,callback){
			this.pomelo.request('connector.entryHandler.enterGame',{gameType:gameType,token:token},callback);
		}

		export function sendBet(pos,coin,chipType,num,callback){
			
			this.pomelo.request('bjl.gameHandler.bet',{pos:pos,coin:coin,chipType,num},function(err,ret){
				callback(err,ret);
			});
		}

		export function getAllRoomData(recordNum,callback){
			this.pomelo.request('bjl.gameHandler.getAllRoomData',{num:recordNum},function(err,ret){
				callback(err,ret);
			});

		}

		export function joinRoom(roomid,callback){
			this.pomelo.request('bjl.gameHandler.joinRoom',{roomid:roomid},function(err,ret){
				callback(err,ret);
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


		


}