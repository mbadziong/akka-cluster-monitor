(function () {
    'use strict';

    var run = () => {
        const DEFAULT_PORT = 8080;

        var express = require('express');
        var FS = require('q-io/fs');
        var ntlm = require('express-ntlm');
        var Bacon = require('baconjs').Bacon;
        var app = express();
        var httpServer = require('http').createServer(app);
        var sio = require('socket.io');
        var bodyParser = require('body-parser');
        var clusterServer = require('./clusterServer/server');
        var MailUtils = require('./utils/mailSender');

        var io = sio.listen(httpServer, {
            log: false
        });
        var less = require('less-middleware');
        var path = require('path');

        app.use(ntlm());
        app.use(bodyParser.json());
        app.use(express.static(__dirname + '/app'));
        app.use(less({
            src: path.join(__dirname, 'app/less'),
            dest: path.join(__dirname, 'app/css'),
            prefix: '/css',
            compress: true
        }));
        app.set('env', process.env.NODE_ENV);

        app.get('/auth', function (req, res) {
            res.send(req.ntlm.UserName);
        });

        app.all('/*', function(req, res, next){
            console.log(`Handled by process: ${process.pid}`);
            next();
        });

        httpServer.listen((DEFAULT_PORT), () => {
            console.log(`Running root server on localhost:${DEFAULT_PORT}`);
            clusterServer.run({
                sockets: io.sockets
            });
        });

        io.sockets.on('connection', socket => {
            socket.on('error', console.log);

            Bacon.fromEvent(socket, 'mailWhenDown')
                .onValue(MailUtils.notificationRequest);

            Bacon.fromEvent(socket, 'workRequest')
                .onValue(clusterServer.sendMessageToCluster);

            Bacon.fromEvent(socket, 'downRequest')
                .onValue(clusterServer.sendMessageToCluster);

            Bacon.fromEvent(socket, 'complexCommandRequest')
                .onValue(clusterServer.sendMessageToCluster);
        });
    };

    module.exports = {
        run: run
    };
}());