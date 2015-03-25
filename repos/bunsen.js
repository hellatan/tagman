/**
 * Created by rob on 3/9/15.
 */

'use strict';

var LibraryRepo = require('./LibraryRepo');
var fs = require('fs');

var Bunsen = LibraryRepo.extend({
    name: 'bunsen',
    user: '1stdibs',
    upstream: 'git@github.com:1stdibs/bunsen.git',
    location: '~/projects/bunsen'
});

// singleton
module.exports = new Bunsen();
