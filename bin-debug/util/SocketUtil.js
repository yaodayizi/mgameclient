var Net;
(function (Net) {
    var SocketUtil;
    (function (SocketUtil) {
        var gateServer;
        var pomelo;
        var isConnect = false;
        function connect(host, port) {
            if (!this.pomelo) {
                this.pomelo = new Pomelo();
            }
            this.pomelo.on('io-error', function (e) {
                console.log('io-error', e);
            });
            this.pomelo.on('error', function (e) {
                console.log('error', e);
            });
            this.pomelo.on('connect', function (res) {
                console.log('connect');
                this.isConnect = true;
            });
            this.pomelo.on('disconnect', function (res) {
                console.log('disconnect');
            });
            this.pomelo.init({ host: host, port: port, log: true }, function (res0) {
                this.pomelo.request('gate.gateHandler.queryEntry', {}, function (res) {
                    this.pomelo.disconnect();
                    if (res.code == 500) {
                        console.log(res.msg);
                        return;
                    }
                    this.connectGameServer({ host: res.host, port: res.port, log: true });
                }.bind(this));
            }.bind(this));
        }
        SocketUtil.connect = connect;
        function connectGameServer(config, callback) {
            if (!this.pomelo) {
                this.pomelo = new Pomelo();
            }
            this.pomelo.init(config, function (res0) {
                console.log('init', res0);
            }.bind(this));
        }
        SocketUtil.connectGameServer = connectGameServer;
        function login(username, password, callback) {
            this.pomelo.request('connector.entryHandler.login', { username: 'test1', password: '123456' }, function (ret) {
                callback(ret);
            }.bind(this));
        }
        SocketUtil.login = login;
        function enterGame(gameType, token, callback) {
            this.pomelo.request('connector.entryHandler.enterGame', { gameType: gameType, token: token }, callback);
        }
        SocketUtil.enterGame = enterGame;
        function addHandler(event, callback) {
            this.pomelo.on(event, callback);
        }
        SocketUtil.addHandler = addHandler;
    })(SocketUtil = Net.SocketUtil || (Net.SocketUtil = {}));
})(Net || (Net = {}));
//# sourceMappingURL=SocketUtil.js.map