(function () {
    "use strict";

    function MonitoringController($scope, $rootScope, $interval, socketService, navigationService, monitoringService, clusterService, toastService) {
        var socket = socketService($scope);

        $scope.$on('$viewContentLoaded', function () {
            socket.on('clusterUpdate', clusterUpdate);
            socket.on('notification', toastService.notify);

            navigationService.currentlyOpenedPage = "monitoring";
        });

        var clusterUpdate = function (state) {
            monitoringService.clusterUpdate(state);
            $scope.state = state;
        };

        $scope.isLeader = function (member) {
            var defaultCardColor = "green";
            var leaderCardColor = "blue";
            var isLeader = clusterService.isLeader(member);

            return "member seen-by "
                + (isLeader ? leaderCardColor : defaultCardColor)
                + " lighten-4 card";
        };

        $scope.downRequest = function (node) {

            socket.emit("downRequest", JSON.stringify({
                User: $rootScope.username,
                Task: monitoringService.getShutDownNodeTaskName(),
                Node: node
            }));
        };

        $scope.$on('$destroy', function () {
            //$interval.cancel(intervalFn);
            $scope.domElement = null;
        });
    }

    angular
        .module('maintenanceTool')
        .controller('MonitoringController', ['$scope', '$rootScope', '$interval', 'SocketService', 'NavigationService', 'MonitoringService', 'ClusterService', 'ToastService', MonitoringController]);
}());