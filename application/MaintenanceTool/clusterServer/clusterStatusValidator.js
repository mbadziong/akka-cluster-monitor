(function () {
    'use strict';

    const RootField = 'ClusterState';
    const RequiredFields = ['Members', 'Unreachable', 'SeenBy', 'Leader', 'AllRoles'];

    var isValidClusterStatus = status => {
        let validationResult = true;

        if(!status.hasOwnProperty(RootField)) {
            return false;
        }

        for (let field of RequiredFields) {
            validationResult = validationResult && (status[RootField].hasOwnProperty(field));
        }
        
        return validationResult;
    };

    module.exports = {
        isValidClusterStatus: isValidClusterStatus
    };
})();
