(function () {
    'use strict';

    var ScopedSocket = function(socket, $rootScope) {
        this.socket = socket;
        this.$rootScope = $rootScope;
        this.listeners = [];
    };

    ScopedSocket.prototype.removeAllListeners = function() {
        for(var i = 0; i < this.listeners.length; i++) {
            var details = this.listeners[i];
            this.socket.removeListener(details.event, details.fn);
        }
    };

    ScopedSocket.prototype.on = function(event, callback) {
        var socket = this.socket;
        var $rootScope = this.$rootScope;

        var wrappedCallback = function() {
            var args = arguments;
            $rootScope.$apply(function() {
                callback.apply(socket, args);
            });
        };

        this.listeners.push({event: event, fn: wrappedCallback});

        socket.on(event, wrappedCallback);
    };

    ScopedSocket.prototype.emit = function(event, data, callback) {
        var socket = this.socket;
        var $rootScope = this.$rootScope;

        socket.emit(event, data, function() {
            var args = arguments;
            $rootScope.$apply(function() {
                if (callback) {
                    callback.apply(socket, args);
                }
            });
        });
    };

    angular
        .module('maintenanceTool')
        .factory('SocketService', function($rootScope) {
            var socket = io.connect();

            return function(scope) {
                var scopedSocket = new ScopedSocket(socket, $rootScope);
                scope.$on('$destroy', function() {
                    scopedSocket.removeAllListeners();
                });
                return scopedSocket;
            };
        });
}());