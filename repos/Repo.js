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
var tags = require('../lib/tags');

var Repo = module.exports = function () {};

assign(Repo.prototype, {
    gitCommitPrefix() {
        return '✔ ';
    },
    exec(cmd, options) {
        options = options || {};
        if (!options.cwd) {
            // how to make get `this.location` better??
            options.cwd = this.getDirectory();
        }
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

    checkTag(version) {
        var self = this;
        this.ensureUpstream();
        this.checkoutBranch('v' + version);
        this.updateBranch('v' + version);

        tags.setLocation(this.getDirectory());

        var tag = tags.checkTags(version);

        tag.then(
            function (result) {
                console.log('result: ',result)
                self.createTag(result.version);
            },
            function (err) {
                console.log('tag:: :', err);
                self.handleBadTag(err);
            }
        )['catch'](function (e) {
                log.errLog('Tagging error', e);
                process.exit(1);
            }
        );

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
