#!/usr/bin/env node

var concat = require('concat-stream'),
    opener = require('opener'),
    tty = require('tty'),
    path = require('path'),
    fs = require('fs'),
    GitHubApi = require('github'),
    github = new GitHubApi({
        version: '3.0.0',
        protocol: 'https'
    });
    argv = require('minimist')(process.argv.slice(2));
    MAX_URL_LEN = 150e3;

if (argv.help || argv.h || !(argv._[0] || !tty.isatty(0))) {
    return help();
}

((argv._[0] && fs.createReadStream(argv._[0])) || process.stdin).pipe(concat(openData));

function openData(body) {
    if (body.length <= MAX_URL_LEN) {
        displayResource('#data=data:application/json,' + encodeURIComponent(
            JSON.stringify(JSON.parse(body.toString()))));
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
                console.error('Unable to create Gist:' + JSON.stringify(res));
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
