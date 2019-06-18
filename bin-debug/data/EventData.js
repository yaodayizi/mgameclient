// TypeScript file
var EventData;
(function (EventData) {
    EventData.Data = {
        LOGIN_SUCCESS: "loginSuccess",
        PLAYER_ENTER: "playerEnter",
        PLAYER_LEVA: "playerLeava",
        GAME_START: "gameStart",
        GAME_BET_ENTER: "gameBetEnter",
        GAME_BET_LEAVA: "gameBetLeava",
        GAME_CHECK: "gameCheck",
        GAME_CALC: "gameCalc",
        GAME_END: "gameEnd",
        SHOW_RESULT: "showResult"
    };
    EventData.GameResult = {
        TIE: 'tie',
        BANKER: 'banker',
        player: 'player'
    };
})(EventData || (EventData = {}));
