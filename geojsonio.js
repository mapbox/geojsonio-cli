#!/usr/bin/env node

var concat = require('concat-stream'),
    opener = require('opener'),
    tty = require('tty'),
    path = require('path'),
    fs = require('fs'),
    validator = require('geojsonhint'),
    GitHubApi = require('github'),
    github = new GitHubApi({
        version: '3.0.0',
        protocol: 'https'
    });
    argv = require('minimist')(process.argv.slice(2));
    MAX_URL_LEN = 150e3,
    BIG_LEN = 5000000;

if (argv.help || argv.h || !(argv._[0] || !tty.isatty(0))) {
    return help();
}

((argv._[0] && fs.createReadStream(argv._[0])) || process.stdin).pipe(concat(openData));

function openData(body) {
    if (body.length > BIG_LEN) {
        console.error('This file is very large, and will likely display slowly on geojson.io');
    }
    if (body.length <= MAX_URL_LEN) {
        var messages = validator.hint(JSON.parse(body.toString()));
        var errors = messages.filter(function (message) {
          return !message.hasOwnProperty('level') || message.level !== 'message';
        })
        if (errors.length == 0) {
            messages.forEach(function (message) {
                console.log(message.message);
            });
            displayResource('#data=data:application/json,' + encodeURIComponent(
                JSON.stringify(JSON.parse(body.toString()))));
        } else {
            console.log("This is not valid GeoJSON. Errors:\n");
            errors.forEach(function (error) {
                console.log(error.message);
            });
        }
    } else {
        github.gists.create({
            description: '',
            public: true,
            files: {
                'map.geojson': {
                    content: JSON.stringify(JSON.parse(body.toString()))
                }
            }
        }, function (err, res) {
            if (err) {
                console.error('Unable to create Gist: ' + JSON.stringify(err));
            } else {
                displayResource('#id=gist:/' + res.id);
            }
        });
    }
}

function displayResource(path) {
    try {
        (argv.print ? console.log : opener)(
                (argv.domain || 'http://geojson.io/') + path);
    } catch(e) {
        console.error('Valid GeoJSON file required as input.');
        help();
    }
}

function help() {
    fs.createReadStream(path.join(__dirname, 'README.md')).pipe(process.stdout);
}
