(function () {
    'use strict';

    function ClusterService(persistenceService) {
        var ClusterService = {};

        ClusterService.isLeader = function (member) {
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
        };

        return ClusterService;
    }

    angular
        .module('maintenanceTool')
        .factory('ClusterService', ['PersistenceService', ClusterService]);
}());