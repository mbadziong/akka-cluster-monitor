(function () {
    'use strict';

    function importTest(name, path) {
        describe(name, function () {
            require(path);
        });
    }

    describe('Backend tests', function () {
        importTest('clusterServerTests', './clusterServerTests/clusterServerTests');
    });
})();

