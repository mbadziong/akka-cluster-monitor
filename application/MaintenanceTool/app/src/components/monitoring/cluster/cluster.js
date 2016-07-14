(function() {
'use strict';

    angular
        .module('maintenanceTool')
        .factory('ClusterService', ClusterService);

    ClusterService.$inject = ['PersistenceService'];
    function ClusterService(persistenceService) {
        var service = {
            isLeader:isLeader
        };
        
        return service;

        function isLeader(member) {
            var currentState = persistenceService.getClusterState();

            if (currentState === undefined) {
                return false;
            }

            var leader = currentState.ClusterState.Leader;

            if (leader === undefined) {
                return false;
            }

            return leader.Host === member.Host &&
                leader.Port === member.Port &&
                leader.System === member.System &&
                leader.Protocol === member.Protocol;
        }
    }
})();