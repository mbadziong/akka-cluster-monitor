(function () {
    'use strict';

    var chai = require('chai');
    var should = chai.should();
    var expect = chai.expect;
    var unirest = require('unirest');

    let clusterDataReader = require('../../clusterServer/server');
    let mockData = require('./clusterServerTools');
    let httpStatusCodes = require('./../../shared/httpStatusCodes');
    let server = {};
    let postUrl = `http://localhost:${clusterDataReader.port}${clusterDataReader.post_address}`;

    describe('Validate cluster server', function () {
        //TODO: refactor because obsolete
        before(function () {
            server = clusterDataReader.server.listen(clusterDataReader.port);
        });

        skip.it('should be able to send POST to server.', function (done) {
            let post = unirest.post(postUrl);
            post.headers({'Accept': 'application/json'})
                .type('json')
                .send({})
                .end(response => {
                    expect(response.statusCode).to.not.equal(httpStatusCodes.NotFound);
                    done();
                });
        });

        skip.it(`POST with valid json returns ${httpStatusCodes.OK} status code.`, function (done) {
            let post = unirest.post(postUrl);
            post.headers({'Accept': 'application/json'})
                .type('json')
                .send(mockData.validNodeInfo)
                .end(response => {
                    expect(response.statusCode).to.equal(httpStatusCodes.OK);
                    done();
                });
        });

        skip.it(`POST with invalid json returns ${httpStatusCodes.BadRequest} status code.`, function (done) {
            let post = unirest.post(postUrl);
            post.headers({'Accept': 'application/json'})
                .type('json')
                .send(mockData.invalidNodeInfo)
                .end(response => {
                    expect(response.statusCode).to.equal(httpStatusCodes.BadRequest);
                    done();
                });
        });

        after(function () {
            server.close();
        });

    });
}());