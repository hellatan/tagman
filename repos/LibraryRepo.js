/**
 * User: Rob Richard
 * Date: 3/10/15
 * Time: 12:02 PM
 */

'use strict';

var Repo = require('./Repo');
var versionHelpers = require('../lib/versionHelpers');

module.exports = Repo.extend({
    getPreviousReleaseBranch(version) {
        return 'v' + versionHelpers.getPreviousVersion(version);
    },
    getDevelopmentBranch() {
        return 'master';
    },
    getCurrentReleaseBranch(version) {
        return 'v' + version;
    }
});