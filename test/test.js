var credentials  = require('./config');
var login = require('../index');
var expect = require('chai').expect;
var assert = require('assert');

describe('Login', () => {
    it('should return accessToken and apiGatewayUri', async () => {
        const rs = await login(credentials);
        expect(rs.accessToken).to.not.be.null;
        expect(rs.apiGatewayUri).to.not.be.null;
        expect(rs.apiGatewayVersion).to.not.be.null;
        expect(rs.accessTokenExpiry).to.not.be.null;
        assert.ok(true);
    });
});