/**
 * Created by rob on 3/19/15.
 */

'use strict';
var GitHubApi = require("github");
var config = require('./config');
var client = new GitHubApi({ version: "3.0.0" });
var partial = require('lodash.partial');
var log = require('./log');

var getToken = partial(
    config.getFromConfigOrPrompt,
    'githubAuthToken',
    'Please enter a GitHub API Token'
);

module.exports = {
    client,
    auth(fn) {
    return getToken()
            .then(token => {
            client.authenticate({
                type: "oauth",
                token: token
            });
    return new Promise((resolve, reject) => {
            fn(client, (err, resp) => {
                if (err) {
        reject(err);
        return;
    }
    resolve(resp);
});
});
})['catch'](function (e) {
    log.errLog('GitHub API error', e);
    process.exit(1);
});
}
};
