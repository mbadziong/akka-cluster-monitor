(function() {
    "use strict";

    var cluster = require('cluster');
    var server = require('./server');

    if(cluster.isMaster) {
        var numWorkers = require('os').cpus().length;

        console.log(`Master cluster setting up ${numWorkers} workers...`);

        for(var i = 0; i < numWorkers; i++) {
            cluster.fork();
        }

        cluster.on('online', worker => {
            console.log(`Worker ${worker.process.pid} is online`);
        });

        cluster.on('disconnect', worker => {
            console.log(`Worker ${worker.process.pid} is disconnected, spawning new worker...`);
            cluster.fork();
        });

        cluster.on('exit', (worker, code, signal) => {
            console.log(`Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`);
            console.log('Starting a new worker');
            cluster.fork();
        });
    } else {
        server.run();
        console.log(`Process ${process.pid} is listening to all incoming request`);
    }
}());