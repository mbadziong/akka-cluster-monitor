(function () {
    'use strict';

    function PersistenceService() {
        var clusterState;
        var PersistenceService = {};

        PersistenceService.getClusterState = function () {
            return clusterState;
        };

        PersistenceService.setClusterState = function (currentState) {
            clusterState = currentState;
        };

        return PersistenceService;
    }

    angular
        .module('maintenanceTool')
        .factory('PersistenceService', PersistenceService);
}());