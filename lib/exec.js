/**
 * User: Rob Richard
 * Date: 3/11/15
 * Time: 10:45 AM
 */

'use strict';

var exec = require('sync-exec');
var sprintf = require('sprintf');
var log = require('./log');

module.exports = function (cmd, options) {
    var result;
    options = options || {};
    if (!options.quiet) {
        log.infoLog(cmd);
    }

    result = exec.apply(this, arguments);

    if (result.status !== 0) {
        throw new Error(sprintf('Error running command `%s`. Return Value: %s.\n%s%s', cmd, result.status, result.stdout, result.stderr));
    }

    return result;
};
