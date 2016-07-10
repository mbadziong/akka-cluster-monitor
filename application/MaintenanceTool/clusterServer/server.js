(function () {
    'use strict';

    var WebSocketClient = require('websocket').client;
    var wsClient = new WebSocketClient();
    var Bacon = require('baconjs').Bacon;
    var MailUtils = require('../utils/mailSender');
    var isValidClusterStatus = require('./clusterStatusValidator').isValidClusterStatus;
    var isValidWebSocketMessage = require('./webSocketMessageValidator').isValidWebSocketMessage;

    const WS_URL = 'ws://localhost:1234/';
    const Thirty_Minutes = 30 * 60 * 1000;
    let sockets;
    let wsConnection;
    var latestState = undefined;
    var pause = false;

    wsClient.on('connectFailed', error => {
        console.log('Connect Error: ' + error.toString());
        setTimeout(connectToWebSocket, 2000);
    });

    wsClient.on('connect', connection => {
        wsConnection = connection;
        console.log('WebSocket Client Connected');

        Bacon.fromEvent(connection, 'error')
            .onValue(error => {
                console.log(`Connection Error:  + ${error.toString()}`);
            });

        Bacon.fromEvent(connection, 'close')
            .onValue(() => {
                wsConnection = undefined;
                console.log('WebSocket Client Disconnected');
                setTimeout(connectToWebSocket, 2000);
            });

        Bacon.fromEvent(connection, 'message')
            .filter(isValidWebSocketMessage)
            .map(message => message.utf8Data)
            .map(JSON.parse)
            .filter(message => message.Message !== undefined)
            .map(message => message.Message)
            .onValue(message => {
                if (sockets !== undefined) {
                    sockets.emit('notification', message);
                }
            });

        Bacon.fromEvent(connection, 'message')
            .throttle(2000)
            .filter(isValidWebSocketMessage)
            .map(message => message.utf8Data)
            .map(JSON.parse)
            .filter(isValidClusterStatus)
            .onValue(message => {
                latestState = message.ClusterState;
                if (sockets !== undefined) {
                    sockets.emit('clusterUpdate', message);
                }
            });

        Bacon.fromPoll(1000, getState)
            .filter(message => message !== undefined)
            .onValue(message => {
                if (pause || message.Unreachable.length === 0) return;
                pause = true;
                setTimeout((() => pause = false), Thirty_Minutes);
                MailUtils.checkForUnreachables(message);
            });
    });

    var connectToWebSocket = () => {
        wsClient.connect(WS_URL);
    };

    var run = config => {
        connectToWebSocket();
        sockets = config.sockets;
    };

    var getState = () => {
        return new Bacon.Next(latestState);
    };

    var sendMessageToCluster = (message) => {
        if (wsConnection === undefined) return;
        wsConnection.sendUTF(message);
    };

    module.exports = {
        run: run,
        getState: getState,
        sendMessageToCluster: sendMessageToCluster
    };
}());