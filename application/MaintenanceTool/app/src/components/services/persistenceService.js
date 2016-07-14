(function() {
'use strict';

    angular
        .module('maintenanceTool')
        .factory('PersistenceService', PersistenceService);

    function PersistenceService() {

        var clusterState;

        var service = {
            getClusterState: getClusterState,
            setClusterState: setClusterState
        };
        
        return service;

        function getClusterState() {
            return clusterState;
        }

        function setClusterState(currentState) {
            clusterState = currentState;
        }
    }
})();