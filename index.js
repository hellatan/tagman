/**
 * User: daletan
 * Date: 3/25/15
 * Time: 3:22 PM
 * Copyright 1stdibs.com, Inc. 2015. All Rights Reserved.
 */


var options = require('./lib/options');
var program = require('commander');
var bunsen = require('./repos/bunsen');
var versionHelpers = require('./lib/versionHelpers');
var version;

program
    .usage('[options] <version>')
    .option('--push-remote [remote]', 'remote to push changes to (default upstream)', 'upstream')
    .option('--pull-remote [remote]', 'remote to pull changes from (default upstream)', 'upstream')
    .parse(process.argv);

options.setUp(program);

version = program.args[0];

versionHelpers.validateVersion(version);

return bunsen.checkTag(version);
//
//[
//    bunsen
//].reduce(function (previousPromise, repo) {
//        return previousPromise.then(() => {
//            return confirm(sprintf('Tag %s ', repo.name))
//                .then(confirmed => {
//                    if (confirmed) {
//                        return repo.cutRelease(version);
//                    }
//                });
//        });
//    }, Promise.resolve())['catch'](function (e) {
//    console.log(colors.bold(e.stack));
//    process.exit(1);
//});


