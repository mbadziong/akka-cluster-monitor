(function() {
'use strict';

    angular
        .module('maintenanceTool')
        .factory('NavigationService', NavigationService);

    function NavigationService() {
        var service = {
            currentlyOpenedPage: ""
        };
        
        return service;
    }
})();