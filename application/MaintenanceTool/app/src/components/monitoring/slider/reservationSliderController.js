(function () {
    'use strict';

    function ReservationSliderController($scope, reservationTimeService) {
        angular.element(document).ready(function () {
            $scope.selectedTime = '30 minutes';
            $scope.$watch('selectedTime', function () {
                reservationTimeService.setChosenTime($scope.selectedTime);
            });

            var possibleReservationValuesInHours = reservationTimeService.getValuesForSlider();

            $('#ReservationPeriodSlider').slider({
                min: 0,
                max: possibleReservationValuesInHours.length - 1,
                value: 0,
                slide: function (event, ui) {
                    $scope.selectedTime = reservationTimeService.convertHoursToHumanReadable(possibleReservationValuesInHours[ui.value]);
                    $scope.$apply();
                }
            });
        });
    }

    angular
        .module('maintenanceTool')
        .controller('ReservationSliderController', ['$scope', 'ReservationTimeService', ReservationSliderController]);
}());