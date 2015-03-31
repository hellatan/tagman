/**
 * User: daletan
 * Date: 3/30/15
 * Time: 7:10 PM
 * Copyright 1stdibs.com, Inc. 2015. All Rights Reserved.
 */
'use strict';

var sprintf = require('sprintf');
var exec = require('./exec');
var log = require('./log');
var tags;

tags = module.exports = {
    errorTypes: {
        MISSING_PATCH: 'MISSING_PATCH',
        TAG_EXISTS: 'TAG_EXISTS',
        VERSIONS: [
            'MAJOR_TOO_LOW',
            'MINOR_TOO_LOW',
            'PATCH_TOO_LOW'
        ]
    },

    setLocation(cwd) {
        if (!cwd) {
            throw new Error('must pass in a cwd');
        }
        this.location = cwd;
    },

    getDirectory() {
        return this.location;
    },

    exec(cmd, options) {
        options = options || {};
        if (!options.cwd) {
            // how to make get `this.location` better??
            options.cwd = this.getDirectory();
        }
        return exec(cmd, options);
    },

    createTag(version) {
        this.exec(sprintf('git tag -a v%s -m "' + this.gitCommitPrefix() + ' release %s"', version, version));
    },

    /**
     *
     * @param {string} version major.minor string
     * @returns {*}
     */
    getLastTag(version) {
        var semVerVals = versionHelpers.getSemVerVals(version);
        var major = semVerVals[0];
        // -n numeric sort
        // -r reverse
        // -t separator/delimiter
        // -k key start position[, end position]
        var listOfTags = this.exec(sprintf('git tag -l %s.* | sort -n -r -t. -k1,1 -k2,2 -k3,3', major));
        // is this too much of an assumption?
        var tags = listOfTags.stdout.split('\n');
        // in reverse order already
        return tags[0];
    },

    checkTags(version) {
        return new Promise((resolve, reject) => {
            var lastTag = this.getLastTag(version);
            var ret = tags.compareTags(version, lastTag);
            if (ret.error !== '') {
                log(version + ' tag already exists');
                reject(ret);
            }
            resolve(ret);
        });
    },

    compareTags(version, lastTag) {
        var versionArr = version.split('.');
        var lastTagArr = lastTag.split('.');
        var ret = {
            error: '',
            version: version,
            lastTag: lastTag
        };
        var hasErrored = false;

        if (version === lastTag) {
            ret.error = sprintf('%s tag version already exists', version);
            ret.errorType = tags.errorTypes.TAG_EXISTS;
            return ret;
        }

        if (versionArr.length < lastTagArr.length) {
            ret.error = sprintf('patch version missing from %s. Current patch is %s', version, lastTagArr[lastTagArr.length - 1]);
            ret.errorType = tags.errorTypes.MISSING_PATCH;
            return ret;
        }

        versionArr.forEach(function (value, index) {
            value = +value;
            var lastTagVal = +(lastTagArr[index]);
            if (value !== lastTagVal) {
                if (!hasErrored && value < lastTagVal) {
                    ret.errorType = this.errorTypes.VERSIONS[index];
                    ret.error = sprintf('%s: %s for %s must be higher than %s', ret.errorType, value, version, lastTagVal);
                    hasErrored = true;
                }
            }
        }, this);

        return ret;
    },
    /**
     *
     * @param {object} tagData
     * @param {boolean} tagData.exists
     * @param {string} tagData.version
     * @param {string} tagData.lastTag
     * @returns {*}
     */
    handleBadTag(tagData) {
        throw new Error(sprintf('Error: %s', tagData.error));
    }
};
