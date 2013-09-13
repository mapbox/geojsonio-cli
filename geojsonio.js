#!/usr/bin/env node

var concat = require('concat-stream'),
    opener = require('opener'),
    tty = require('tty'),
    fs = require('fs'),
    iniparser = require('iniparser'),
    request = require('request'),
    argv = require('minimist')(process.argv.slice(2));

if (argv.help || argv.h || !(argv._[0] || !tty.isatty(0))) return help();

((argv._[0] && fs.createReadStream(argv._[0])) || process.stdin).pipe(concat(openData));

function openData(body) {
    var HOME = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;

    if (!process.stdout.isTTY) {
        var gitconfig = iniparser.parseSync(HOME + '/.gitconfig');
        var login = argv.login || (gitconfig.github && gitconfig.github.login);

        if (login) {
            request.post('https://api.github.com/authorizations', {
                auth: {
                    user: login
                },
                scopes: ['gist'],
                note: 'geojsonio-cli'
            }).pipe(process.stdout);
        } else {
            console.error('Valid --login argument required.');
        }
    }

    /*
    try {
        (argv.print ? console.log : opener)((argv.domain || 'http://geojson.io/') +
            '#data=data:application/json,' + encodeURIComponent(
            JSON.stringify(JSON.parse(body.toString()))));
    } catch(e) {
        console.error('Valid GeoJSON file required as input.');
        help();
    }
    */
}

function help() { fs.createReadStream('README.md').pipe(process.stdout); }
