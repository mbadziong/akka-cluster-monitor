(function () {
    'use strict';

    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport();
    var notifiedUsers = [];
    const MAIL_SUBJECT = "Failure inside cluster!";
    const MAIL_SENDER = 'server@MaintenanceTool';

    var sendMail = (receiver, subject, message) => {
        transporter.sendMail({
            from: MAIL_SENDER,
            to: receiver,
            subject: subject,
            text: message
        }, error => {
            if (error) {
                //TODO: Logger
            }
        });
    };

    var checkForUnreachables = (clusterState) => {
        if (clusterState === undefined) {
            return;
        }

        let unreachables = clusterState.Unreachable;

        if (unreachables.length > 0) {
            notifiedUsers.forEach((user) => {
                sendMail(user, MAIL_SUBJECT, unreachables);
            });
        }
    };

    var notificationRequest = (request) => {
        let username = request.username;
        let notify = request.value;

        if (notify) {
            notifiedUsers.push(username);
        } else {
            notifiedUsers = notifiedUsers.filter(user => user !== username);
        }
    };

    module.exports = {
        notificationRequest: notificationRequest,
        checkForUnreachables: checkForUnreachables
    };
}());