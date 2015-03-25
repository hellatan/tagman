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
    getPreviousVersion(version) {
        var prevMinor;
        var [major, minor] = version.split('.');
        prevMinor = Number(minor) - 1;
        return [major, prevMinor].join('.');
    },
    getMajorVersion(version) {
        return version.split('.')[0];
    },
    printHeader(version) {
        var majorVersion = versionHelpers.getMajorVersion(version);

        console.log(repeat('✄  ', majorVersion));
    }
};
