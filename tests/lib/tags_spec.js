/**
 * User: daletan
 * Date: 3/30/15
 * Time: 9:55 PM
 * Copyright 1stdibs.com, Inc. 2015. All Rights Reserved.
 */
'use strict';

var chai = require('chai');
var expect = chai.expect;
var spies = require('chai-spies');
var tags = require('../../lib/tags');

chai.use(spies);

describe('tags', function () {
    describe('setLocation', function () {
        it('should set a location correctly', function () {
            tags.setLocation('./some/path');
            var dir = tags.getDirectory();
            expect(dir).to.equal('./some/path');
        });
    });
    describe('compareTags', function () {
        it('should throw a `TAG_EXISTS` error', function () {
            var prevTag = '5.16';
            var version = '5.16';
            var tagData = tags.compareTags(version, prevTag);
            expect(tagData.error).to.be.a('string');
            expect(tagData.error).to.equal('5.16 tag version already exists');
            expect(tagData.errorType).to.equal(tags.errorTypes.TAG_EXISTS);
        });
        it('should throw a `MISSING_PATCH` error', function () {
            var prevTag = '5.16.1';
            var version = '5.16';
            var tagData = tags.compareTags(version, prevTag);
            expect(tagData.error).to.be.a('string');
            expect(tagData.error).to.equal('patch version missing from 5.16. Current patch is 1');
            expect(tagData.errorType).to.equal(tags.errorTypes.MISSING_PATCH);
        });
        it('should throw a `VERSIONS["PATCH_TOO_LOW"]` error', function () {
            var prevTag = '5.16.2';
            var version = '5.16.1';
            var tagData = tags.compareTags(version, prevTag);
            expect(tagData.error).to.be.a('string');
            expect(tagData.error).to.equal('PATCH_TOO_LOW: 1 for 5.16.1 must be higher than 2');
            expect(tagData.errorType).to.equal(tags.errorTypes.VERSIONS[2]);
        });
    });
    /*
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
    */
});
