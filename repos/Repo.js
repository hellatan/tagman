/**
 * Created by rob on 3/9/15.
 */

'use strict';

var classExtend = require('ampersand-class-extend');
var assign = require('lodash.assign');
var expandTilde = require('expand-tilde');
var exec = require('../lib/exec');
var sprintf = require('sprintf');
var confirm = require('../lib/confirm');
var options = require('../lib/options');
var log = require('../lib/log');
var versionHelpers = require('../lib/versionHelpers');

var Repo = module.exports = function () {};

assign(Repo.prototype, {
    gitCommitPrefix() {
        return '✄👷';
    },
    exec(cmd, options) {
        options = options || {};
        if (!options.cwd) {
            options.cwd = this.getDirectory();
        }
        console.log('options: ', options);
        return exec(cmd, options);
    },

    checkoutBranch(branch) {
        this.log('checking out branch %s', branch);
        this.exec(sprintf('git checkout %s', branch));
    },

    updateBranch(branch) {
        var remote = options.getPullRemote();
        this.log('getting %s up to date with %s/%s', branch, remote, branch);
        this.exec(sprintf('git pull --rebase %s %s', remote, branch));
    },

    getDirectory() {
        return expandTilde(this.location);
    },
    createTag(version) {
        this.ensureUpstream();
        //this.checkoutBranch('v' + version);
        //this.updateBranch('v' + version);

        var semverVals = '';

        var tags = this.getLastTag(version);


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
        var lastTag = tags[0];
        console.log('list of tags: ', lastTag);
        return lastTag;
    },
    getTags(version) {
        console.log('location: ', this.location);
        var semVerVals = versionHelpers.getSemVerVals(version);
        var major = semVerVals[0];
        var listOfTags = this.exec(sprintf('git tag -l %s.* | sort -n -r -t. -k1,1 -k2,2 -k3,3 -k4,4', major))
        var lastTag = listOfTags ? listOfTags.stdout.split('\n') : null;
        console.log('last tag: ', lastTag);
    },
    push(branch, remote) {
        return confirm(sprintf('Push %s to %s?', branch, remote), () => {
            this.log('pushing %s %s', remote, branch);
            this.exec(sprintf('git push %s %s', remote, branch));
        });
    },
    ensureUpstream() {
        this.log('ensuring remote exists');
        try {
            this.exec(sprintf('git remote show %s', options.getPullRemote()), {quiet: true});
        }
        catch(e) {
            this.exec(sprintf('git remote add %s %s', options.getPullRemote(), this.upstream));
        }
    }
}, log);

Repo.extend = classExtend;
