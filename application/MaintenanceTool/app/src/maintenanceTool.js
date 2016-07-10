(function () {
    "use strict";

    var maintenanceTool = angular.module('maintenanceTool', ['ngRoute', 'angular-bacon']);

    maintenanceTool.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/monitoring', {
                templateUrl: 'src/components/monitoring/monitoring.html',
                controller: 'MonitoringController'
            })
            .when('/management', {
                templateUrl: 'src/components/management/management.html',
                controller: 'ManagementController'
            })
            .otherwise({
                redirectTo: '/monitoring'
            })
    }]);

    maintenanceTool.run(function ($rootScope, $http) {
        $http({
            method: 'GET',
            url: '/auth'
        }).then(function successCallback(response) {
            $rootScope.username = response.data;
        }, function errorCallback(err) {
            $rootScope.username = "unknown";
        });
    });
}());