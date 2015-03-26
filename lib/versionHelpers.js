/**
 * User: Rob Richard
 * Date: 3/10/15
 * Time: 11:49 AM
 */

'use strict';

var isNumeric = require("isnumeric");
var repeat = require('repeat-string');

var versionHelpers = module.exports = {
    validateVersion(version) {
        if (!version) {
            throw new Error('Please supply a version number!');
        }
        var [major, minor] = version.split('.');
        if (!major || !minor || !isNumeric(major) || !isNumeric(minor)) {
            throw new Error('Invalid version number!');
        }
    },
    getPreviousVersionMinor(version) {
        var [major, minor] = version.split('.');
        var prevMinor = Number(minor) - 1;
        return [major, prevMinor].join('.');
    },
    getPreviousVersionPatch(version) {
        var [major, minor, patch] = version.split('.');
        var prevPatch = !patch ? '0' : Number(patch) - 1;;
        return [major, minor, prevPatch].join('.');
    },
    getMajorVersion(version) {
        return this.getSemVerVals(version)[0];
    },
    getSemVerVals(version) {
        return version.split('.');
    },
    printHeader(version) {
        var majorVersion = versionHelpers.getMajorVersion(version);

        console.log(repeat('✄  ', majorVersion));
    }
};
