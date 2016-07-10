(function () {
    'use strict';

    function ManagementController($rootScope, $scope, navigationService, socketService, toastService, managementService) {
        var socket = socketService($scope);

        $scope.$on('$viewContentLoaded', function () {
            navigationService.currentlyOpenedPage = 'management';
            socket.on('notification', toastService.notify);

            $('.collapsible').collapsible({
                accordion: false
            });

            $scope.selectedTask = "cleanup";
            $scope.complexCommandCode = managementService.getComplexCommandCode();
        });

        $scope.complexCommandRequest = function() {
            socket.emit("complexCommandRequest", JSON.stringify({
                User: $rootScope.username,
                Task: "complexCommand",
                Code: $scope.complexCommandCode
            }));
        };

        $scope.taskRequest = function () {
            socket.emit("workRequest", JSON.stringify({
                User: $rootScope.username,
                Task: $scope.selectedTask
            }));
        };

        $scope.emailNotificationChanged = function () {
            socket.emit("mailWhenDown", {
                username: $rootScope.username,
                value: $scope.emails
            });
        };

        $scope.$on('$destroy', function () {
            //$interval.cancel(intervalFn);
            $scope.domElement = null;
        });
    }

    angular
        .module('maintenanceTool')
        .controller('ManagementController', ['$rootScope', '$scope', 'NavigationService', 'SocketService', 'ToastService', 'ManagementService', ManagementController]);
}());