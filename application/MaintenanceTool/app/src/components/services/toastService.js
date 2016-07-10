(function () {
    'use strict';

    function ToastService() {
        var ToastService = {};

        ToastService.notify = function (message) {
            Materialize.toast(message, 4000)
        };

        return ToastService;
    }

    angular
        .module('maintenanceTool')
        .factory('ToastService', ToastService);
}());