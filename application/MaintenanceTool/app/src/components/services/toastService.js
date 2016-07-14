(function() {
'use strict';

    angular
        .module('maintenanceTool')
        .factory('ToastService', ToastService);

    function ToastService() {
        var service = {
            notify: notify
        };
        
        return service;

        function notify(message) {
            Materialize.toast(message, 4000)
        }
    }
})();