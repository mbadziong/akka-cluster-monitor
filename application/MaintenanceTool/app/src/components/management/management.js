(function () {
    'use strict';

    function ManagementService() {
        var ManagementService = {};

        ManagementService.getComplexCommandCode = function () {
            return `
                var x = 0.5;
                var y = 2;
                return x / y;
                    `;
        };

        return ManagementService;
    }

    angular
        .module('maintenanceTool')
        .factory('ManagementService', [ManagementService]);
}());