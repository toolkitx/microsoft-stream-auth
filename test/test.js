var credentials  = require('./config');
var login = require('../index');
var expect = require('chai').expect;
var assert = require('assert');

describe('Login', () => {
    it('should return accessToken and apiGatewayUri', async () => {
        const account = process.env.TEST_ACCOUNT;
        const pwd = process.env.TEST_PWD;
        const cred = account && pwd ? {account, pwd} : credentials;
        const rs = await login(cred);
        expect(rs.accessToken).to.not.be.null;
        expect(rs.apiGatewayUri).to.not.be.null;
        expect(rs.apiGatewayVersion).to.not.be.null;
        expect(rs.accessTokenExpiry).to.not.be.null;
        assert.ok(true);
    });
});