(function () {
    'use strict';

    function NavigationService() {
        var NavigationService = {};

        NavigationService.currentlyOpenedPage = "";

        return NavigationService;
    }

    angular
        .module('maintenanceTool')
        .factory('NavigationService', NavigationService);
}());