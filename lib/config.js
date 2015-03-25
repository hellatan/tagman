/**
 * Created by rob on 3/19/15.
 */

'use strict';

var fs = require('fs');
var expandTilde = require('expand-tilde');
var inquirer = require("inquirer");

var cache = {};
var configLocation = expandTilde('~/.cutman.json');

var loadConfig = function () {
    var config;

    try {
        config = require(configLocation);
    } catch (e) {
        config = {};
    }
    return config;
};

var writeConfig = function (config) {
    config = config || {};
    return fs.writeFileSync(configLocation, JSON.stringify(config, null, 2));
};

module.exports = {
    get(key) {
        var config;
        if (cache[key]) {
            return cache[key];
        }
        // try to get token from cutman config in home dir
        config = loadConfig();
        cache[key] = config[key];
        return config[key];
    },
    set(key, value) {
        var config = loadConfig();
        config[key] = value;
        cache[key] = value;
        writeConfig(config);
    },
    unset(key) {
        module.exports.set(key, undefined);
    },
    getFromConfigOrPrompt(key, message) {
        return new Promise((resolve, reject) => {
            // try to get value from cutman config in home dir
            var savedValue = module.exports.get(key);
            if (savedValue) {
                resolve(savedValue);
                return;
            }

            // prompt for value
            inquirer.prompt( [{
                name: 'prompt',
                message
            }], answers => {
                if (answers.prompt) {
                    module.exports.set(key, answers.prompt);
                    resolve(answers.prompt);
                } else {
                    reject(new Error("Didn't get value from config or prompt"));
                }
            });
        });
    }
};
