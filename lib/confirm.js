/**
 * User: Rob Richard
 * Date: 3/11/15
 * Time: 1:37 PM
 */

'use strict';
var inquirer = require("inquirer");

module.exports = function (msg, fn) {
    return new Promise(function (resolve, reject) {
        inquirer.prompt([{message: msg, name: 'confirm', type: 'confirm'}], function (answers) {
            if (answers.confirm && fn) {
                fn();
            }
            resolve(answers.confirm);
        });
    });
};