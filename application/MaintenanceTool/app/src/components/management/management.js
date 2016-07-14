(function() {
'use strict';

    angular
        .module('maintenanceTool')
        .factory('ManagementService', ManagementService);

    function ManagementService() {
        var service = {
            getComplexCommandCode:getComplexCommandCode
        };
        
        return service;

        function getComplexCommandCode() {
            return `
                var x = 0.5;
                var y = 2;
                return x / y;
                    `;
        }
    }
})();