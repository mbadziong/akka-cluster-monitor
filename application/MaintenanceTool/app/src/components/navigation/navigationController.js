(function () {
    'use strict';

    function NavigationController($scope, $rootScope, navigationService) {
        $scope.pageOpened = function (pageName) {
            return navigationService.currentlyOpenedPage === pageName;
        };

        $scope.username = $rootScope.username;
    }

    angular
        .module('maintenanceTool')
        .controller('NavigationController', ['$scope', '$rootScope', 'NavigationService', NavigationController]);
}());