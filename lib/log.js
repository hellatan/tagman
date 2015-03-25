/**
 * Created by rob on 3/19/15.
 */

'use strict';

var colors = require('colors/safe');
var sprintf = require('sprintf');

module.exports ={
    log(msg, ...args) {
        console.log('', colors.blue(sprintf(msg, ...args)));
    },
    infoLog(msg, ...args) {
        console.log(' ', colors.grey(sprintf(msg, ...args)));
    },
    errlog(msg, ...args) {
        console.log(colors.red.bold(sprintf(msg, ...args)));
    }
};