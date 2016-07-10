(function () {
    'use strict';

    function MonitoringService(persistenceService) {
        var MonitoringService = {};

        MonitoringService.clusterUpdate = function (newClusterStatus) {
            persistenceService.setClusterState(newClusterStatus);
        };

        MonitoringService.getState = function () {
            return persistenceService.getClusterState();
        };

        MonitoringService.getShutDownNodeTaskName = function () {
            return "shutdown";
        };

        return MonitoringService;
    }

    angular
        .module('maintenanceTool')
        .factory('MonitoringService', ['PersistenceService', MonitoringService]);
}());