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
        this.checkoutBranch('v' + version);
        this.updateBranch('v' + version);

        var semverVals = '';

    },
    getTags(major) {
        // -n numeric sort
        // -r reverse
        // -t separator/delimiter
        // -k key start position[, end position]
        console.log('location: ', this.location);
        var tags = this.exec(sprintf('git tag -l %s.* | sort -n -r -t. -k1,1 -k2,2 -k3,3 -k4,4', major))
        console.log(tags.stdout);
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
