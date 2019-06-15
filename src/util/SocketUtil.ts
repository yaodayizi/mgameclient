module Net.SocketUtil {
        var  gateServer: Pomelo;
        var  pomelo: Pomelo;
        var  isConnect: boolean = false;
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
			this.pomelo.request('connector.entryHandler.login',{username:'test1',password:'123456'},function(ret){
				callback(ret);
			}.bind(this));
		}

		export function enterGame(gameType,token,callback){
			this.pomelo.request('connector.entryHandler.enterGame',{gameType:gameType,token:token},callback);
		}

		export function addHandler(event,callback){
			this.pomelo.on(event,callback);
		}

		


}