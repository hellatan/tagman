/**
 * User: daletan
 * Date: 3/25/15
 * Time: 10:20 PM
 * Copyright 1stdibs.com, Inc. 2015. All Rights Reserved.
 */

'use strict';

var expect = require('chai').expect;
var versionHelpers = require('../../lib/versionHelpers');

describe('versionHelper', function () {
    describe('validate version', function () {
        it('should throw a supply version error', function () {
            expect(versionHelpers.validateVersion()).to.Throw(new Error('Please supply a version number!'));
        });
        it('should throw an error for an invalid version', function () {
            //expect(versionHelpers.validateVersion('string.here')).to.throw(function () { throw new Error('Invalid version number!') });
            expect(versionHelpers.validateVersion('booya')).to.throw(new Error);
        });
    });
    describe('getPreviousVersion', function () {
        it('should return 5.16', function () {
            var version = '5.17.0';
            var prevVersionMinor = versionHelpers.getPreviousVersionMinor(version);
            expect(prevVersionMinor).to.equal('5.16');
        });
        it('should return 5.17.4', function () {
            var version = '5.17.5';
            var prevVersionPatch = versionHelpers.getPreviousVersionPatch(version);
            expect(prevVersionPatch).to.equal('5.17.4');
        });
    });
});
