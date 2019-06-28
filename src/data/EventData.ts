// TypeScript file
module EventData{
    export var Data = {
                LOGIN_SUCCESS:"loginSuccess",
                PLAYER_ENTER:"playerEnter",
                PLAYER_LEAVE:"playerLeave",
                GAME_START:"gameStart",
                GAME_BET:"gameBet",
                GAME_BET_ENTER:"gameBetEnter",
                GAME_BET_LEAVE:"gameBetLeave",
                GAME_CHECK:"gameCheck",
                GAME_CALC:"gameCalc",
                GAME_END:"gameEnd",
                SHOW_RESULT:"showResult",
                JOIN_ROOM:"joinRoom",
                EXIT_ROOM:"exitRoom"
                
                //disconnect:"disconnect"        

    }

    export var GameResult = {
        TIE:'tie',
        BANKER:'banker',
        player:'player',
        BOTH:'both',
        NO_PAIR:'none'
    }
}