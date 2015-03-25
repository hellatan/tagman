/**
 * Created by rob on 3/15/15.
 */

'use strict';

var pullRemote;
var pushRemote;

module.exports = {
    setUp (options) {
        pullRemote = options.pullRemote;
        pushRemote = options.pushRemote;
    },
    getPullRemote() {
        return pullRemote;
    },
    getPushRemote() {
        return pushRemote;
    }
};