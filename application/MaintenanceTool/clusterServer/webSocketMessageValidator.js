(function () {
    'use strict';

    const ExpectedType = 'utf8';
    const RequiredFields = ['type', 'utf8Data'];

    var isValidWebSocketMessage = message => {
        let validationResult = true;

        for (let field of RequiredFields) {
            validationResult = validationResult && (message.hasOwnProperty(field));
        }

        validationResult = validationResult && message.type === ExpectedType;

        return validationResult;
    };

    module.exports = {
        isValidWebSocketMessage: isValidWebSocketMessage
    };
})();
