(function () {
    'use strict';

    function ReservationTimeService() {
        var HOURS_IN_DAY = 24;
        var RESERVATION_DAYS = [1, 2, 3, 4, 5, 7];
        var RESERVATION_HOURS = [0.5, 1, 2, 3, 4, 5, 6, 7, 8, 12];
        var possibleReservationValuesInHours = null;
        var sliderSelectedValue = null;
        var ReservationTimeService = {};

        var calcPossibleReservationValues = function () {
            var reservationDays = RESERVATION_DAYS;

            reservationDays.forEach(function (element, index, array) {
                array[index] = element * HOURS_IN_DAY;
            });

            possibleReservationValuesInHours = RESERVATION_HOURS.concat(reservationDays);
        };

        ReservationTimeService.getValuesForSlider = function () {
            if (possibleReservationValuesInHours == null) {
                calcPossibleReservationValues();
            }
            return possibleReservationValuesInHours;
        };

        ReservationTimeService.setChosenTime = function (value) {
            sliderSelectedValue = value;
        };

        ReservationTimeService.getChosenTime = function () {
            return sliderSelectedValue;
        };

        ReservationTimeService.getSelectedSliderIndex = function () {
            return $('#ReservationPeriodSlider').slider('value');
        };

        ReservationTimeService.getHoursToAdd = function () {
            return possibleReservationValuesInHours[ReservationTimeService.getSelectedSliderIndex()];
        };

        ReservationTimeService.convertHoursToHumanReadable = function (hours) {
            if (hours >= 168 && hours % 168 == 0) {
                return hours / 168 + ' week';
            } else if (hours >= 48 && hours % 24 == 0) {
                return hours / 24 + ' days';
            } else if (hours > 1) {
                return hours + ' hours';
            } else if (hours == 1) {
                return '60 minutes';
            }
            return '30 minutes';
        };

        return ReservationTimeService;
    }

    angular
        .module('maintenanceTool')
        .factory('ReservationTimeService', ReservationTimeService);
}());